import os
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://127.0.0.1:27017/mbti-database')
client = MongoClient(MONGO_URI)
db = client.get_default_database()
interactions_collection = db['interactions']
users_collection = db['users']

# Define a custom dataset for DT training
class InteractionDataset(Dataset):
    def __init__(self, interactions):
        self.data = []
        for interaction in interactions:
            # Ensure user is populated; query if necessary
            if not isinstance(interaction.get('user'), dict):
                user_doc = users_collection.find_one({"_id": interaction['user']})
                interaction['user'] = user_doc if user_doc is not None else {}
            # For example, assume each sample is a tuple of (state, action, reward)
            # Adapt this as needed to match your data format.
            state = np.array(interaction.get('state', np.zeros(10)), dtype=np.float32)
            action = interaction.get('action', 0)
            reward = interaction.get('reward', 0.0)
            self.data.append((state, action, reward))

    def __len__(self):
        return len(self.data)
    
    def __getitem__(self, idx):
        return self.data[idx]

# Dummy Decision Transformer model (for illustration)
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

def train_dt_model():
    # Load interactions from MongoDB
    interactions = list(interactions_collection.find().sort("timestamp", 1))
    dataset = InteractionDataset(interactions)
    dataloader = DataLoader(dataset, batch_size=32, shuffle=True)

    state_dim = 10  # Example dimension
    action_dim = 5  # Number of actions
    model = DecisionTransformer(state_dim, action_dim)
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    loss_fn = nn.MSELoss()

    epochs = 10
    for epoch in range(epochs):
        epoch_loss = 0
        for state, action, reward in dataloader:
            # Forward pass
            outputs = model(state)
            # Dummy target: replace with your DT-specific loss function and targets as needed
            target = torch.zeros_like(outputs)
            loss = loss_fn(outputs, target)
            
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            
            epoch_loss += loss.item()
        print(f"Epoch {epoch+1}/{epochs}, Loss: {epoch_loss/len(dataloader)}")
    
    # Save the model
    torch.save(model.state_dict(), "./models/dt_chatbot.pth")
    print("Decision Transformer model saved successfully.")
    return model

def test_dt_model():
    # Initialize the model with the same dimensions used during training
    model = DecisionTransformer(state_dim=10, action_dim=5)
    # Load the saved model state
    model.load_state_dict(torch.load("./models/dt_chatbot.pth"))
    model.eval()

    # Create a test state (replace with actual test data if available)
    test_state = torch.randn(1, 10)
    # Perform inference
    predicted_action = model(test_state)
    print("Predicted action:", predicted_action)

if __name__ == '__main__':
    print("Connecting to MongoDB...")
    # Train the model
    trained_model = train_dt_model()
    # Test the trained model
    test_dt_model()
    client.close()  # Close MongoDB connection

