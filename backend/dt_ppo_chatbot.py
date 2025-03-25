from transformers import DecisionTransformerModel, GPT2Tokenizer
from stable_baselines3 import PPO
import numpy as np

# Load DT model and tokenizer
dt_model = DecisionTransformerModel.from_pretrained("./fine-tuned-dt")
dt_tokenizer = GPT2Tokenizer.from_pretrained("./fine-tuned-dt")

# Load PPO model
ppo_model = PPO.load("ppo_chatbot")

# Generate conversation plan with DT
def generate_plan(prompt):
    inputs = dt_tokenizer(prompt, return_tensors="pt")
    plan = dt_model.generate(**inputs, max_length=50)
    return dt_tokenizer.decode(plan[0], skip_special_tokens=True)

# Generate response with PPO
current_state = np.random.rand(10)  # Replace with real state
conversation_plan = generate_plan("User: Hi, how are you?")
response = ppo_model.predict(current_state)[0]  # Replace with actual PPO logic

print(f"Plan: {conversation_plan}")
print(f"Response Action: {response}")
