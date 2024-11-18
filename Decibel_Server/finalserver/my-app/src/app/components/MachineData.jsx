'use client'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush, ReferenceArea } from 'recharts';

export default function MachineData() {
  const [data, setData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]); // Stores full data from date range
  const [displayedData, setDisplayedData] = useState([]); // Stores data to be shown in batches
  const [resetCount, setResetCount] = useState(0);
  const [selectedLine, setSelectedLine] = useState(null);
  const [zoom, setZoom] = useState({ startIndex: null, endIndex: null });
  const [isPlotting, setIsPlotting] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Tracks pagination
  const wsRef = useRef(null);
  const [isLoading, setIsLoading] = useState('false');
  const [error, setError] = useState(null);

  const apiKey = "0cb95e982d6cf049e3d4397f40ce20a3";

  const initializeWebSocket = () => {
    const ws = new WebSocket("ws://technest.ddns.net:8001/ws");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection opened");
      ws.send(apiKey);
    };

    ws.onmessage = async (event) => {
      console.log("Message received from WebSocket:", event.data);
      try {
        const parsedData = JSON.parse(event.data);
        const timestamp = new Date().toISOString();

        const newDataPoint = {
          timestamp,
          Power: parsedData["Energy Consumption"]?.Power,
          Pressure: parsedData.Pressure,
          Force: parsedData.Force,
          Position: parsedData["Position of the Punch"],
        };

        await fetch('/api/machine/db', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            timestamp,
            ...parsedData,
          }),
        });

        setData((prevData) => {
          // Reset data if it reaches 200 points
          const newData = prevData.length >= 20 ? prevData.slice(20) : prevData;
          return [...newData, newDataPoint];
        });
      } catch (error) {
        console.warn("Received non-JSON message or fetch error:", event.data);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  };

  useEffect(() => {
    if (isPlotting) {
      initializeWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isPlotting]);

  const handleDateRangeFetch = async () => {
    if (startDate && endDate) {
      try {
        // Add loading state
        setIsLoading(true);
        setError(null);
  
        const response = await fetch(`/api/machine/history?startDate=${startDate}&endDate=${endDate}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const historicalData = await response.json();
        console.log("Fetched Data:", historicalData);
        
        setHistoricalData(historicalData);
        setDisplayedData(historicalData.slice(0, 10));
        setCurrentPage(1);
  
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        
        // Clear data on error (optional)
        setHistoricalData([]);
        setDisplayedData([]);
        
      } finally {
        setIsLoading(false);
      }
    }
  };
  

  const handleViewMore = () => {
    const nextPage = currentPage + 1;
    const newItems = historicalData.slice(currentPage * 10, nextPage * 10);
    setDisplayedData((prev) => [...prev, ...newItems]);
    setCurrentPage(nextPage);
  };

  const handleButtonClick = (dataKey) => {
    setSelectedLine(dataKey);
  };

  const showAllLines = () => {
    setSelectedLine(null);
  };

  const togglePlotting = () => {
    setIsPlotting(!isPlotting);
  };

  const handleBrushChange = (e) => {
    if (e && e.startIndex !== undefined && e.endIndex !== undefined) {
      setZoom({ startIndex: e.startIndex, endIndex: e.endIndex });
    }
  };

  const resetZoom = () => {
    setZoom({ startIndex: null, endIndex: null });
  };

  // Function to format the timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-GB', { timeZone: 'UTC' }); // Adjust to preferred format and timezone
  };

  return (
    <div>
      <h1 className='m-4 font-medium text-xl'>Real-Time Machine Data</h1>

      {/* View More Button */}
      {displayedData.length < historicalData.length && (
        <Button onClick={handleViewMore} variant="contained" color="primary" style={{ marginTop: '1rem' }}>
          View More
        </Button>
      )}

      {/* Control Buttons */}
      <div className="m-4 flex space-x-4">
        <button onClick={showAllLines} className={`px-4 py-2 rounded ${selectedLine === null ? "bg-black text-white" : "bg-gray-700 text-white"}`}>Show All</button>
        <button onClick={() => handleButtonClick("Power")} disabled={selectedLine && selectedLine !== "Power"} className={`px-4 py-2 rounded ${selectedLine && selectedLine !== "Power" ? "bg-gray-400" : "bg-blue-500 text-white"}`}>Show Energy Consumption</button>
        <button onClick={() => handleButtonClick("Pressure")} disabled={selectedLine && selectedLine !== "Pressure"} className={`px-4 py-2 rounded ${selectedLine && selectedLine !== "Pressure" ? "bg-gray-400" : "bg-red-500 text-white"}`}>Show Pressure</button>
        <button onClick={() => handleButtonClick("Force")} disabled={selectedLine && selectedLine !== "Force"} className={`px-4 py-2 rounded ${selectedLine && selectedLine !== "Force" ? "bg-gray-400" : "bg-teal-500 text-white"}`}>Show Force</button>
        <button onClick={() => handleButtonClick("Position")} disabled={selectedLine && selectedLine !== "Position"} className={`px-4 py-2 rounded ${selectedLine && selectedLine !== "Position" ? "bg-gray-400" : "bg-purple-500 text-white"}`}>Show Position of Punch</button>
        <button onClick={togglePlotting} className="px-4 py-2 bg-gray-500 text-white rounded">{isPlotting ? "Stop Plotting" : "Start Plotting"}</button>
        <button onClick={resetZoom} className="px-4 py-2 bg-black text-white rounded">Reset Zoom</button>
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          {(selectedLine === null || selectedLine === "Power") && <Line type="monotone" dataKey="Power" stroke="#8884d8" activeDot={{ r: 8 }} />}
          {(selectedLine === null || selectedLine === "Pressure") && <Line type="monotone" dataKey="Pressure" stroke="#d0ed57" />}
          {(selectedLine === null || selectedLine === "Force") && <Line type="monotone" dataKey="Force" stroke="#20b2aa" />}
          {(selectedLine === null || selectedLine === "Position") && <Line type="monotone" dataKey="Position" stroke="#8884d8" />}
          <Brush dataKey="timestamp" height={30} stroke="#8884d8" onChange={handleBrushChange} />
          {zoom.startIndex !== null && zoom.endIndex !== null && <ReferenceArea x1={data[zoom.startIndex]?.timestamp} x2={data[zoom.endIndex]?.timestamp} strokeOpacity={0.3} />}
        </LineChart>
      </ResponsiveContainer>

      <div className="m-4">
        <p className="font-medium text-lg mt-4">Data reset count: {resetCount}</p>
      </div>

      {/* Date Range Selector */}
      <div className="m-4 flex space-x-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <button onClick={handleDateRangeFetch} className="px-4 py-2 bg-blue-500 text-white rounded">
          Fetch Data
        </button>
      </div>


      {/* Display Historical Data in MUI Table */}
      {displayedData.length > 0 && (
      <TableContainer component={Paper} style={{ maxHeight: 400, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Power</TableCell>
              <TableCell>Pressure</TableCell>
              <TableCell>Force</TableCell>
              <TableCell>Position</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{formatDate(entry.timestamp)}</TableCell>
                <TableCell>{entry.Energy_Consumption.Power}</TableCell>
                <TableCell>{entry.Pressure}</TableCell>
                <TableCell>{entry.Force}</TableCell>
                <TableCell>{entry.Position_of_the_Punch}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
    </div>
  );
}
