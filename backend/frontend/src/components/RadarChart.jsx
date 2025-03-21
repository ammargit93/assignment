import React, { useRef, useEffect } from 'react';
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');

    // Destroy previous chart instance if it exists
    if (chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }

    // Create a new Radar Chart
    chartRef.current.chart = new Chart(ctx, {
      type: 'radar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false, // Disable aspect ratio to allow full width
        scales: {
          r: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
            angleLines: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
            pointLabels: {
              font: {
                size: 14,
                family: 'Roboto',
              },
            },
          },
        },
        plugins: {
          tooltip: {
            enabled: true,
            bodyFont: {
              family: 'Roboto',
              size: 12,
            },
            titleFont: {
              family: 'Roboto',
              size: 14,
            },
          },
          legend: {
            position: 'top',
            labels: {
              font: {
                family: 'Roboto',
                size: 14,
              },
            },
          },
        },
      },
    });

    // Cleanup function to destroy the chart instance
    return () => {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
    };
  }, [data]);

  return (
    <div style={{ width: '100%', height: '400px' }}> {/* Full-width container */}
      <canvas ref={chartRef} style={{ width: '100%', height: '100%' }}></canvas> {/* Full-width canvas */}
    </div>
  );
};

export default RadarChart;