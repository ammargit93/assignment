import React, { useState, useEffect } from 'react';
import Card from './components/Card';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';
import './App.css';

function App() {
  const [selectedYearBar, setSelectedYearBar] = useState('2016');
  const [selectedSector, setSelectedSector] = useState('');
  const [barChartData, setBarChartData] = useState({ relevance: [], likelihood: [] });
  const [barChartLabels, setBarChartLabels] = useState([]);
  const [lineChartData, setLineChartData] = useState({ years: [], intensity: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // List of sectors for the dropdown
  const sectors = [
    'Energy', 'Environment', '', 'Government', 'Aerospace & defence',
    'Manufacturing', 'Retail', 'Financial services', 'Support services',
    'Information Technology', 'Healthcare', 'Food & agriculture',
    'Automotive', 'Tourism & hospitality', 'Construction', 'Security',
    'Transport', 'Water', 'Media & entertainment'
  ];

  // Fetch data for BarChart
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`http://localhost:8000/barchart/?year=${selectedYearBar}&sector=${selectedSector}`)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        setBarChartLabels(data.region || []);
        setBarChartData({
          relevance: data.relevance || [],
          likelihood: data.likelihood || [],
        });
        setLoading(false);
      })
      .catch((error) => setError(error));
  }, [selectedYearBar, selectedSector]);

  // Fetch data for LineChart
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`http://localhost:8000/linechart/?sector=${selectedSector}`)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        setLineChartData({
          years: data.years || [],
          intensity: data.intensity || [],
        });
        setLoading(false);
      })
      .catch((error) => setError(error));
  }, [selectedSector]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="App">
      <h1>Interactive Charts</h1>

      {/* Bar Chart Card */}
      <Card>
        <div className="card-header">
          <h2>Relevance and Likelihood by Region ({selectedYearBar})</h2>
          <select
            className="year-select"
            value={selectedYearBar}
            onChange={(e) => setSelectedYearBar(e.target.value)}
          >
            {[2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2025, 2028, 2030, 2035, 2040, 2050].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <BarChart data={barChartData} labels={barChartLabels} />
      </Card>

      {/* Line Chart Card */}
      <Card>
        <div className="card-header">
          <h2>Average Intensity Over Time</h2>
          <select
            className="sector-select"
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
          >
            <option value="">All Sectors</option>
            {sectors.map((sector, index) => (
              <option key={index} value={sector}>{sector || 'Uncategorized'}</option>
            ))}
          </select>
        </div>
        {lineChartData.intensity.length > 0 && lineChartData.years.length > 0 ? (
          <LineChart data={lineChartData.intensity} labels={lineChartData.years} />
        ) : (
          <div className="error">No data available for Line Chart</div>
        )}
      </Card>
    </div>
  );
}

export default App;