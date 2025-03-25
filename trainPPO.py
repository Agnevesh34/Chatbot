import os
import numpy as np
import gym
from gym import spaces
from stable_baselines3 import PPO
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Connect to MongoDB using PyMongo
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://127.0.0.1:27017/mbti-database')
client = MongoClient(MONGO_URI)
db = client.get_default_database()
# Collections: interactions, users, and MBTI profiles
interactions_collection = db['interactions']
users_collection = db['users']
mbti_collection = db['mbti']

# Helper functions
def encode_mbti(mbti):
    # Pad/truncate the MBTI string to 4 characters and convert each character to its ordinal value.
    mbti = mbti.ljust(4)[:4]
    return np.array([ord(c) for c in mbti], dtype=np.float32)

def normalize_answers(answers):
    # Normalize answers from 1-5 scale to 0-1
    arr = np.array(answers, dtype=np.float32)
    return arr / 5.0

# Dummy sentiment analysis function (replace with your actual logic if needed)
def analyze_sentiment(text):
    try:
        text_lower = text.lower()
        if "good" in text_lower:
            return 1.0
        elif "bad" in text_lower:
            return -1.0
        else:
            return 0.0
    except Exception as e:
        print("Sentiment analysis failed:", e)
        return 0.0

# Define the custom Gym environment
class ChatbotEnv(gym.Env):
    def __init__(self):
        super(ChatbotEnv, self).__init__()
        # Define action space (Discrete: 5 strategies)
        self.action_space = spaces.Discrete(5)
        # Define observation space: 4 for MBTI encoding + 5 for personality answers + 1 for sentiment = 10 dimensions
        self.observation_space = spaces.Box(low=0, high=255, shape=(10,), dtype=np.float32)
        self.interactions = []
        self.currentInteraction = 0

    def load_interactions(self):
        # Load interactions from MongoDB, sorted by timestamp ascending
        cursor = interactions_collection.find().sort("timestamp", 1)
        self.interactions = list(cursor)
        # Populate the user field for each interaction if not already a dict
        for interaction in self.interactions:
            if not isinstance(interaction.get('user'), dict):
                user_doc = users_collection.find_one({"_id": interaction['user']})
                interaction['user'] = user_doc if user_doc is not None else {}

    def reset(self):
        self.currentInteraction = 0
        return self._get_observation(0)

    def step(self, action):
        interaction = self.interactions[self.currentInteraction]
        reward = self._calculate_reward(action, interaction)
        done = self.currentInteraction >= len(self.interactions) - 1
        info = {
            'mbti': interaction['user'].get('mbti', 'unknown') if isinstance(interaction.get('user'), dict) else 'unknown',
            'responseStrategy': action
        }
        self.currentInteraction += 1
        obs = self._get_observation(self.currentInteraction) if not done else np.zeros(self.observation_space.shape, dtype=np.float32)
        return obs, reward, done, info

    def _get_observation(self, index):
        interaction = self.interactions[index]
        if isinstance(interaction.get('user'), dict) and interaction['user'].get('mbti'):
            mbti_enc = encode_mbti(interaction['user']['mbti'])
        else:
            mbti_enc = np.zeros(4, dtype=np.float32)
        answers = interaction.get('user', {}).get('personalityAnswers', [3]*5)
        answers_norm = normalize_answers(answers)
        if len(answers_norm) < 5:
            answers_norm = np.pad(answers_norm, (0, 5 - len(answers_norm)), mode='constant')
        else:
            answers_norm = answers_norm[:5]
        sentiment = interaction.get('sentimentScore', 0.0)
        obs = np.concatenate([mbti_enc, answers_norm, np.array([sentiment], dtype=np.float32)])
        return obs.astype(np.float32)

    def _calculate_reward(self, action, interaction):
        reward = 0
        feedback = interaction.get('feedback', 'neutral')
        if feedback == 'positive':
            reward += 1
        elif feedback == 'negative':
            reward -= 1
        # Optionally add MBTI-specific reward adjustments here
        return reward

if __name__ == '__main__':
    print("Connecting to MongoDB...")
    env = ChatbotEnv()
    env.load_interactions()
    print(f"Loaded {len(env.interactions)} interactions")
    
    model = PPO("MlpPolicy", env, learning_rate=0.0003, batch_size=256, gamma=0.99, verbose=1)
    print("Starting training...")
    model.learn(total_timesteps=10000, callback=lambda locals, globals: print(f"Step: {locals.get('step', 'N/A')}, Reward: {locals.get('episode_reward', 'N/A')}"))
    print("Saving model...")
    model.save("./models/ppo_chatbot")
    
    client.close()  # Close MongoDB connection
    print("Training completed successfully")
    
    # Scheduled training can be implemented using external schedulers or cron jobs.






