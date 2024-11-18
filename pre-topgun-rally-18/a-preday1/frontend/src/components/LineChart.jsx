import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AmplitudeLineChart = () => {
    const [data, setData] = useState([]);

    // Function to fetch the last 5 data points
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/get_last_5_data');
            const result = await response.json();
            setData(result);
            console.log("Data fetched:", result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        // Initial fetch of data
        fetchData();

        // Set up polling to fetch data every 5 seconds
        const interval = setInterval(() => {
            fetchData();
        }, 5000);

        // Clear interval on component unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }} />
                <YAxis domain={[-1, 1]} label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amplitude" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default AmplitudeLineChart;
