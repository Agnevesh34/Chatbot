import gymnasium as gym
from gymnasium import Env
from gymnasium.spaces import Box, Discrete
import numpy as np
from stable_baselines3 import PPO
from stable_baselines3.common.env_util import make_vec_env

class ChatbotEnv(Env):
    def __init__(self):
        super().__init__()
        self.action_space = Discrete(4)  # 4 possible actions
        self.observation_space = Box(low=0, high=1, shape=(10,), dtype=np.float32)
    
    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        self.state = np.random.rand(10)
        return self.state, {}
    
    def step(self, action):
        reward = self._calculate_reward(action)
        terminated = False
        truncated = False
        info = {}
        return self.state, reward, terminated, truncated, info
    
    def _calculate_reward(self, action):
        return 1 if action == 0 else -1

# Initialize the environment
env = make_vec_env(lambda: ChatbotEnv(), n_envs=1)

# Train PPO model
model = PPO("MlpPolicy", env, verbose=1)
model.learn(total_timesteps=10000)
model.save("ppo_chatbot")
