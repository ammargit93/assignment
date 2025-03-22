import React, { useRef, useEffect } from "react";
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
Chart.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;
    const ctx = chartRef.current.getContext("2d");

    // Destroy previous instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Define custom colors for each section
    const backgroundColors = [
      "rgba(255, 99, 132, 0.2)", // Red
      "rgba(54, 162, 235, 0.2)", // Blue
      "rgba(255, 206, 86, 0.2)", // Yellow
      "rgba(75, 192, 192, 0.2)", // Green
      "rgba(153, 102, 255, 0.2)", // Purple
      "rgba(255, 159, 64, 0.2)", // Orange
    ];

    // Plugin to color different axis areas
    const backgroundPlugin = {
      id: "backgroundPlugin",
      beforeDraw(chart) {
        const { ctx, scales } = chart;
        const { r } = scales;

        ctx.save();

        const step = r.max / backgroundColors.length; // Divide into equal steps

        for (let i = backgroundColors.length - 1; i >= 0; i--) {
          ctx.beginPath();
          ctx.arc(r.xCenter, r.yCenter, (i + 1) * (r.drawingArea / backgroundColors.length), 0, 2 * Math.PI);
          ctx.fillStyle = backgroundColors[i];
          ctx.fill();
          ctx.closePath();
        }

        ctx.restore();
      },
    };

    // Create new Radar Chart
    chartInstanceRef.current = new Chart(ctx, {
      type: "radar",
      data: {
        labels: data.labels,
        datasets: data.datasets.map((dataset) => ({
          label: dataset.label,
          data: dataset.data,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          pointBackgroundColor: "rgba(54, 162, 235, 1)",
          pointBorderColor: "#fff",
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            angleLines: {
              display: true,
            },
            grid: {
              circular: true,
            },
          },
        },
      },
      plugins: [backgroundPlugin], // Register the plugin
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default RadarChart;
