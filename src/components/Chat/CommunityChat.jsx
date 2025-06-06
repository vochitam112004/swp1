import React, { useState, useEffect } from 'react';

function CommunityChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Fetch initial messages from the server or mock data
    const fetchMessages = async () => {
      // Replace with actual API call
      const initialMessages = [
        { id: 1, user: 'User1', text: 'I just quit smoking! Feeling great!' },
        { id: 2, user: 'User2', text: 'What tips do you have for staying smoke-free?' },
      ];
      setMessages(initialMessages);
    };

    fetchMessages();
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        user: 'You',
        text: newMessage,
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="community-chat">
      <h2>Community Chat</h2>
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <strong>{msg.user}: </strong>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default CommunityChat;