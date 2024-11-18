import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import LineChart from './components/LineChart';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ENDPOINT = "http://localhost:5000";
const socket = socketIOClient(ENDPOINT, {
  transports: ["websocket"], // Use WebSocket transport only
});

function App() {
  const [data, setData] = useState([]);
  const [messages, setMessages] = useState([]);

  // Fetch previous data on initial load
  useEffect(() => {
    const fetchPreviousData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/get_last_5_data`);
        const result = await response.json();
        setData(result);

        // Show toast for any previous data with "failure" status
        result.forEach((item) => {
          if (item.status === "failure") {
            toast.error(`Previous failure detected: ${item.status}`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        });
      } catch (error) {
        console.error("Error fetching previous data:", error);
      }
    };

    fetchPreviousData();
  }, []);

  // Set up socket event listeners for 'data_saved' and 'response' events
  useEffect(() => {
    // Listen for 'data_saved' events
    socket.on("data_saved", (newData) => {
      setData((prevData) => [...prevData, newData.data]);

      if (newData.data.status === "failure") {
        toast.error(`Failure detected: ${newData.data.status}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    });

    // Listen for 'response' events and show toast
    socket.on("response", (response) => {
      console.log("Server response received:", response);
      setMessages((prevMessages) => [...prevMessages, response.message]);

      // Show toast notification when 'response' event is received
      toast.success(response.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    // Cleanup event listeners on component unmount
    return () => {
      socket.off("data_saved");
      socket.off("response");
    };
  }, []);

  // Function to send a message to the server
  function sendMessage() {
    socket.emit("message", "Test message");
  }

  // Render the list of messages received from the server
  const messageList = messages.map((message, index) => (
    <li key={index}>{index + 1}: {message}</li>
  ));

  return (
    <div className='App'>
      <h2>Server Messages</h2>
      <ul>{messageList}</ul>
      <button onClick={sendMessage}>Greet</button>
      
      <LineChart data={data} />
      <ToastContainer />
    </div>
  );
}

export default App;
