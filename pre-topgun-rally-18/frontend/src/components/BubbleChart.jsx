import React from 'react';
import { Bubble } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, LinearScale, PointElement } from 'chart.js';

// Register required chart elements
ChartJS.register(Tooltip, Legend, LinearScale, PointElement);

const defaultData = {
  datasets: [
    {
      label: 'Bubble Dataset',
      data: [
        { x: 10, y: 20, r: 15 },
        { x: 15, y: 25, r: 10 },
        { x: 30, y: 10, r: 20 },
        { x: 40, y: 40, r: 25 },
        { x: 50, y: 15, r: 18 },
      ],
      backgroundColor: '#36A2EB',
      hoverBackgroundColor: '#FF6384',
    },
  ],
};

function BubbleChart({ data = defaultData, width = 300, height = 400 }) {
  return (
    <div style={{width: '400px'}} className='mb-10'>
      <Bubble data={data} width={width} height={height} options={{ maintainAspectRatio: false }} />
    </div>
  );
}

export default BubbleChart;
