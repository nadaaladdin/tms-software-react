import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js';

const ChartComponent = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.labels,
        datasets: [{
          label: data.datasetLabel,
          data: data.datasetData,
          backgroundColor: data.datasetBackgroundColor,
          borderColor: data.datasetBorderColor,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }, [data]);

  return <canvas ref={chartRef}></canvas>;
};

export default ChartComponent;
