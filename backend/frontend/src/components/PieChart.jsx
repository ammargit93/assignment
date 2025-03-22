import React, { useRef, useEffect } from 'react';
import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js'; // Import PieController

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend, PieController); // Register PieController

const PieChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Store the Chart instance

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null; // Reset the reference
    }

    // Create a new Chart instance
    chartInstance.current = new Chart(ctx, {
      type: 'pie', // Use "pie" type
      data: {
        labels: data.map(item => item.label), // Extract labels from data
        datasets: [
          {
            label: 'Pestle Distribution',
            data: data.map(item => item.value), // Extract values from data
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
            ], // Color palette for pie slices
            borderColor: 'rgba(255, 255, 255, 1)', // White border for slices
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true, // Make the chart responsive
        maintainAspectRatio: false, // Disable aspect ratio to fill the container
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
        chartInstance.current = null; // Reset the reference
      }
    };
  }, [data]); // Re-run effect when data changes

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}> {/* Full-width and height container */}
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PieChart;