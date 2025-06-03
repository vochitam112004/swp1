import React, { useState, useEffect } from 'react';

function CoachChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Load initial messages from a mock API or local storage
    const initialMessages = [
      { id: 1, text: 'Hello! How can I assist you today?', sender: 'coach' },
    ];
    setMessages(initialMessages);
  }, []);

  const handleSendMessage = () => {
    if (input.trim()) {
      const newMessage = { id: messages.length + 1, text: input, sender: 'user' };
      setMessages([...messages, newMessage]);
      setInput('');
      // Here you would typically send the message to the backend
    }
  };

  return (
    <div className="coach-chat">
      <h2>Chat with Your Coach</h2>
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className={message.sender}>
            {message.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default CoachChat;