import React from 'react';
import './index.css';
import Barchart from './components/Barchart';
import DonutChart from './components/DonutChart';
import BubbleChart from './components/BubbleChart';
import Linechart from './components/Linechart';
import AreaChartComponent from './components/AreaChart';
import CandlestickChart from './components/CandlestickChart';

function App() {
  return (
    <div className="min-h-screen p-6 bg-gray-50">

      <div className="grid grid-cols-4 gap-2 w-full">
        <Barchart width={400} />
        <DonutChart  width={400} />
        <BubbleChart width={600} />
        <Linechart width={400} />
        <AreaChartComponent width={400}/>
        <CandlestickChart />
        {/* Repeat or add more chart components if needed */}
      </div>
    </div>
  );
}

export default App;
