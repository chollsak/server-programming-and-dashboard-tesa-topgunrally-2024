'use client'
import { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import Sidebar from '../components/Sidebar';
import { Card, CardContent, Typography, Box, Grid, CircularProgress, Button } from '@mui/material';

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null); // WebSocket connection state
  const MQTT_BROKER_URL = 'ws://10.64.67.107:9001';

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const processMessage = (message) => {
    try {
      const parsedData = JSON.parse(message.toString());
      return {
        ...parsedData,
        predict: parsedData.predict ? parsedData.predict.charAt(0) : '',
      };
    } catch (error) {
      console.error('Error parsing message:', error);
      return { predict: 0, confidence: 0, team: "Unknown" };
    }
  };

  // Set up MQTT client and handle incoming messages
  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER_URL);

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe('tgr2024/team/Decibel', (err) => {
        if (err) {
          console.error('Subscription error:', err);
        } else {
          console.log('Subscribed to topic');
        }
      });
    });

    client.on('message', (topic, message) => {
      const processedMessage = processMessage(message);
      const newMessage = {
        topic,
        ...processedMessage,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prevMessages) => [newMessage, ...prevMessages.slice(0, 4)]); // Keep only the latest 5 messages
    });

    client.on('error', (error) => {
      console.error('MQTT connection error:', error);
    });

    return () => {
      client.end();
    };
  }, []);

  // Initialize WebSocket connection on port 5000
  useEffect(() => {
    const websocket = new WebSocket('ws://10.64.67.107:5000');

    websocket.onopen = () => {
      console.log('WebSocket connection established on port 5000');
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  // Handle button click to send a message over WebSocket
  const handleButtonClick = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      // Send a message to the WebSocket server
      ws.send(JSON.stringify({ topic: 'tgr2024/team/Decibel', message: 'Button clicked: Sending sound file' }));
      console.log('Message sent to WebSocket server');
    } else {
      console.error('WebSocket is not connected');
    }
  };

  const latestMessage = messages[0] || { predict: 0, confidence: 0, team: "N/A", timestamp: "No data available" };

  return (
    <div className="flex min-h-screen w-full bg-gray-100 font-sans">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Real-Time Dashboard</h1>
        
        {/* Latest Data Section */}
        <Box className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <Typography variant="h5" className="font-semibold text-gray-800 mb-4">Latest Data</Typography>
          <Grid container spacing={4}>
            <Grid item xs={6} sm={3}>
              <Card className="shadow-md border border-gray-200 rounded-lg p-4 text-center">
                <Typography variant="h6" className="text-gray-600">Team</Typography>
                <Typography variant="h4" className="font-bold text-blue-500">{latestMessage.team}</Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card className="shadow-md border border-gray-200 rounded-lg p-4 text-center">
                <Typography variant="h6" className="text-gray-600">Predict</Typography>
                <Typography variant="h4" className="font-bold text-green-500">{latestMessage.predict}</Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card className="shadow-md border border-gray-200 rounded-lg p-4 text-center">
                <Typography variant="h6" className="text-gray-600">Confidence</Typography>
                <Typography variant="h4" className="font-bold text-purple-500">{latestMessage.confidence}</Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card className="shadow-md border border-gray-200 rounded-lg p-4 text-center">
                <Typography variant="h6" className="text-gray-600">Timestamp</Typography>
                <Typography variant="h4" className="font-bold text-gray-500">{latestMessage.timestamp}</Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Historical Messages */}
        <Typography variant="h5" className="font-semibold text-gray-800 mb-4">Recent Messages</Typography>

        {/* Button to trigger WebSocket publish */}
        <Button variant="contained" color="primary" className="mb-4" onClick={handleButtonClick}>
          Sound .wav Downloader
        </Button>

        <Grid container spacing={4}>
          {messages.length ? (
            messages.map((msg, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card className="shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="flex flex-col items-start p-4">
                    <Typography variant="h6" className="font-semibold text-gray-700 mb-2">
                      {msg.topic}
                    </Typography>
                    <Typography variant="body1" className="text-gray-600">
                      <strong>Team:</strong> {msg.team || 'N/A'}
                    </Typography>
                    <Typography variant="body1" className="text-gray-600">
                      <strong>Predict:</strong> {msg.predict || '0'}
                    </Typography>
                    <Typography variant="body1" className="text-gray-600">
                      <strong>Confidence:</strong> {msg.confidence || '0'}
                    </Typography>
                    <Typography variant="body1" className="text-gray-500 mt-2">
                      <strong>Timestamp:</strong> {msg.timestamp || 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Box className="w-full flex justify-center items-center mt-10">
              <CircularProgress />
              <Typography variant="body1" className="ml-4 text-gray-500">Fetching data...</Typography>
            </Box>
          )}
        </Grid>
      </div>
    </div>
  );
}
