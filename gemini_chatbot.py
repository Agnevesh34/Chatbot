# backend/gemini_chatbot.py
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load API key from .env
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.0-flash')

# Chat loop
print("Chatbot: Hello! How can I help you today? (Type 'exit' to end the chat)")
while True:
    user_input = input("You: ")
    if user_input.lower() == "exit":
        print("Chatbot: Goodbye!")
        break
    try:
        response = model.generate_content(user_input)
        print(f"Chatbot: {response.text}")
    except Exception as e:
        print(f"Chatbot: Sorry, I encountered an error. ({str(e)})")