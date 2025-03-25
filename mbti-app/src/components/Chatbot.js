import React, { useState, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = ({ userData }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Load any previous messages from localStorage
    const savedChat = localStorage.getItem('chatHistory');
    if (savedChat) setMessages(JSON.parse(savedChat));
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to chat history
    const newMessages = [...messages, { text: input, isUser: true }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          message: input, 
          userData 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages([...newMessages, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, { 
        text: error.message || "Sorry, I'm having trouble connecting. Please try again later.", 
        isUser: false 
      }]);
    }
  };

  // New handler for ensemble inference via combined endpoint
  const handleCombinedResponse = async () => {
    // For demonstration, using a dummy state vector (an array of 10 zeros).
    const dummyState = Array(10).fill(0);
    try {
      const response = await fetch('http://localhost:5000/api/combined_response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: dummyState })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Append the combined response to chat history
      setMessages([...messages, { text: `Combined action: ${data.final_action}`, isUser: false }]);
    } catch (error) {
      console.error('Combined chat error:', error);
      setMessages([...messages, { text: error.message || "Combined inference error", isUser: false }]);
    }
  };

  const handleFeedback = async (messageIndex, isPositive) => {
    try {
      await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messages[messageIndex].text,
          isPositive,
          userData
        })
      });
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <h2>{userData.mbti} Personality Assistant</h2>
        <p>Purpose: {userData.purpose}</p>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
            <div className="message-content">{msg.text}</div>
            {!msg.isUser && (
              <div className="feedback-buttons">
                <button 
                  className="feedback-btn positive" 
                  onClick={() => handleFeedback(i, true)}
                >
                  👍
                </button>
                <button
                  className="feedback-btn negative"
                  onClick={() => handleFeedback(i, false)}
                >
                  👎
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>

      {/* New button to trigger combined inference */}
      <div style={{ marginTop: '10px' }}>
        <button onClick={handleCombinedResponse}>Get Combined Response</button>
      </div>
    </div>
  );
};

export default Chatbot;





