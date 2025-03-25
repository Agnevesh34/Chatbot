import sys
import json
import torch
import numpy as np
from stable_baselines3 import PPO
import torch.nn as nn

# --- Define your DT model (should match your training code) ---
class DecisionTransformer(nn.Module):
    def __init__(self, state_dim, action_dim, hidden_dim=128):
        super(DecisionTransformer, self).__init__()
        self.fc1 = nn.Linear(state_dim, hidden_dim)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_dim, action_dim)
        
    def forward(self, x):
        out = self.fc1(x)
        out = self.relu(out)
        out = self.fc2(out)
        return out

def load_models():
    # Load PPO model (assumes it was saved as a zip file by stable-baselines3)
    ppo_model = PPO.load("./models/ppo_chatbot.zip")  # Adjust extension if needed
    # Load Decision Transformer (DT) model
    dt_model = DecisionTransformer(state_dim=10, action_dim=5)
    dt_model.load_state_dict(torch.load("./models/dt_chatbot.pth"))
    dt_model.eval()
    return ppo_model, dt_model

def combine_predictions(ppo_pred, dt_pred, weight=0.5):
    # For simplicity, assume both outputs are vectors of length 5.
    # We use a weighted average of the two predictions.
    combined = weight * ppo_pred + (1 - weight) * dt_pred
    # Choose the index with the highest value as the final action.
    final_action = int(np.argmax(combined))
    return final_action, combined.tolist()

if __name__ == '__main__':
    # Expect a JSON string as a command-line argument that includes the state.
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input provided"}))
        sys.exit(1)
    
    try:
        input_json = sys.argv[1]
        data = json.loads(input_json)
        # Expect state to be an array of 10 numbers.
        state = np.array(data["state"], dtype=np.float32).reshape(1, -1)
    except Exception as e:
        print(json.dumps({"error": f"Invalid input: {e}"}))
        sys.exit(1)
    
    ppo_model, dt_model = load_models()
    
    # For PPO, we use its predict() method.
    ppo_action, _ = ppo_model.predict(state)
    # Convert the PPO output into a one-hot vector
    ppo_pred = np.zeros(5, dtype=np.float32)
    ppo_pred[ppo_action] = 1.0
    
    # For DT, run the state through the model
    state_tensor = torch.tensor(state)
    dt_output = dt_model(state_tensor).detach().numpy()[0]
    
    final_action, combined_output = combine_predictions(ppo_pred, dt_output)
    
    result = {
        "final_action": final_action,
        "combined_output": combined_output
    }
    print(json.dumps(result))
