import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Connect to the server
const socket = io('http://localhost:5000', {
  autoConnect: true,
});

function Socket() {
  const [messages, setMessages] = useState([]);

  // Effect to handle incoming 'response' events from the server
  useEffect(() => {
    socket.on('response', (response) => {
      console.log('Server response received:', response);
      // Update the state to include the new message immediately
      setMessages((prevMessages) => [...prevMessages, response.message]);
    });

    // Cleanup event listener when the component unmounts
    return () => {
      socket.off('response');
    };
  }, []);

  function sendMessage() {
    socket.emit('message', "Test message");
  }

  // Render the list of messages
  const messageList = messages.map((message, index) => (
    <li key={index}>{index + 1}: {message}</li>
  ));

  return (
    <div className='App'>
      <h2>Server Messages</h2>
      <ul>{messageList}</ul>
      <button onClick={sendMessage}>Greet</button>
    </div>
  );
}

export default Socket;
