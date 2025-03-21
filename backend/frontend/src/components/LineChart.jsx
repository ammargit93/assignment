import React, { useRef, useEffect } from 'react';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const LineChart = ({ data, labels }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Store the Chart instance

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create a new Chart instance
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels, // Use labels from props
        datasets: [
          {
            label: 'Average Intensity',
            data: data, // Use data from props
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            fill: true,
          },
        ],
      },
      options: {
        responsive: true, // Make the chart responsive
        maintainAspectRatio: false, // Disable aspect ratio to fill the container
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              font: {
                family: 'Roboto',
                size: 12,
              },
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                family: 'Roboto',
                size: 12,
              },
            },
          },
        },
        plugins: {
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
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
            display: true,
            position: 'top',
            labels: {
              font: {
                family: 'Roboto',
                size: 14,
              },
            },
          },
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuad',
        },
      },
    });

    // Cleanup function to destroy the chart instance
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data, labels]); // Re-run effect when data or labels change

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}> {/* Full-width and height container */}
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default LineChart;