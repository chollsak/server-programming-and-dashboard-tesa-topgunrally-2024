import React from 'react';
import ReactApexChart from 'react-apexcharts';

function generateOHLCData() {
    const startDate = new Date('2024-02-14T00:00:00Z');
    const endDate = new Date('2024-02-14T23:59:59Z');
    const intervalMinutes = 60; // 1-hour intervals

    const data = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
        const open = Math.random() * 100 + 100;
        const close = Math.random() * 100 + 100;
        const high = Math.max(open, close, Math.random() * 100 + 150);
        const low = Math.min(open, close, Math.random() * 50 + 50);

        data.push({
            x: new Date(currentDate),
            y: [open.toFixed(2), high.toFixed(2), low.toFixed(2), close.toFixed(2)],
        });

        currentDate = new Date(currentDate.getTime() + intervalMinutes * 60 * 1000);
    }
    return data;
}

function CandlestickChart() {
    const series = [
        {
            data: generateOHLCData(),
        },
    ];

    const options = {
        chart: {
            type: 'candlestick',
            height: 350,
        },
        xaxis: {
            type: 'datetime',
        },
        yaxis: {
            tooltip: {
                enabled: true,
            },
        },
        title: {
            text: 'Candlestick Chart Example',
            align: 'left',
        },
    };

    return <ReactApexChart options={options} series={series} type="candlestick" height={350} />;
}

export default CandlestickChart;
