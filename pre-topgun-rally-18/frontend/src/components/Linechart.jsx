import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';

function generateRandomData() {
    const startDate = new Date('2024-02-14T00:00:00Z');
    const endDate = new Date('2024-02-14T23:59:59Z');
    const intervalMinutes = 15;

    const data = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
        const timestamp = currentDate.toISOString();
        const value = Math.random() * 100;

        data.push({ timestamp, value });
        currentDate = new Date(currentDate.getTime() + intervalMinutes * 60 * 1000);
    }
    return data;
}

function Linechart(props) {
    const data = generateRandomData();

    return (
        <LineChart width={props.width} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tickFormatter={(tick) => new Date(tick).toLocaleTimeString()} />
            <YAxis yAxisId="left">
                <Label value="Value" offset={0} position="insideLeft" angle={-90} />
            </YAxis>
            <Tooltip labelFormatter={(label) => new Date(label).toLocaleTimeString()} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" yAxisId="left" dot={false} />
        </LineChart>
    );
}

export default Linechart;
