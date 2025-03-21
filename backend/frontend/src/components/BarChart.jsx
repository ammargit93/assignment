// src/components/BarChart.js
import React, { useRef, useEffect } from 'react';
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

const BarChart = ({ data, labels }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Relevance',
            data: data.relevance,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
            hoverBorderColor: 'rgba(75, 192, 192, 1)',
          },
          {
            label: 'Likelihood',
            data: data.likelihood,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255, 99, 132, 0.8)',
            hoverBorderColor: 'rgba(255, 99, 132, 1)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
          },
          legend: {
            display: true,
            position: 'top',
          },
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuad',
        },
      },
    });

    return () => chart.destroy(); // Cleanup on unmount
  }, [data, labels]);

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
  
};

export default BarChart;