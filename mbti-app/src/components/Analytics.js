import React, { useState, useEffect } from 'react';
import { BarChart, PieChart } from '@mui/x-charts';

const Analytics = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="analytics-container">
      <h2>User Analytics</h2>
      <BarChart
        dataset={data}
        xAxis={[{ dataKey: '_id', label: 'MBTI Type' }]}
        series={[{ dataKey: 'count', label: 'Users' }]}
        height={400}
      />
    </div>
  );
};