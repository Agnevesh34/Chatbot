from openai import OpenAI
from dotenv import load_dotenv
import os

# Load API key from .env
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# Initialize client
client = OpenAI(api_key=api_key)

# Generate response with GPT-3.5
def generate_response(prompt):
    response = client.completions.create(
        model="gpt-3.5-turbo-instruct",  # Updated model
        prompt=prompt,
        max_tokens=50,
        temperature=0.7,
        top_p=0.9,
        frequency_penalty=0.5,
        presence_penalty=0.5,
    )
    return response.choices[0].text.strip()

# Chat loop
print("Chatbot: Hello! How can I help you today? (Type 'exit' to end the chat)")
while True:
    user_input = input("You: ")
    if user_input.lower() == "exit":
        print("Chatbot: Goodbye!")
        break
    response = generate_response(user_input)
    print(f"Chatbot: {response}")
