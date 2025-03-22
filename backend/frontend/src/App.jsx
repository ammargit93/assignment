import React, { useState, useEffect } from 'react';
import Card from './components/Card';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';
import RadarChart from './components/RadarChart';
import PieChart from './components/PieChart'; // Import PieChart
import './App.css';

function App() {
  const [selectedYearBar, setSelectedYearBar] = useState('2016');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('oil');
  const [selectedCountry, setSelectedCountry] = useState(''); // State for selected country
  const [barChartData, setBarChartData] = useState({ relevance: [], likelihood: [] });
  const [barChartLabels, setBarChartLabels] = useState([]);
  const [lineChartData, setLineChartData] = useState({ years: [], intensity: [] });
  const [radarChartData, setRadarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]); // State for PieChart data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sectors = [
    'Energy', 'Environment', '', 'Government', 'Aerospace & defence',
    'Manufacturing', 'Retail', 'Financial services', 'Support services',
    'Information Technology', 'Healthcare', 'Food & agriculture',
    'Automotive', 'Tourism & hospitality', 'Construction', 'Security',
    'Transport', 'Water', 'Media & entertainment'
  ];

  const countries = [
    'United States of America', 'Mexico', '', 'Nigeria', 'Lebanon',
    'Russia', 'Saudi Arabia', 'Angola', 'Egypt', 'South Africa',
    'India', 'Ukraine', 'Azerbaijan', 'China', 'Colombia', 'Niger',
    'Libya', 'Brazil', 'Mali', 'Indonesia', 'Iraq', 'Iran',
    'South Sudan', 'Venezuela', 'Burkina Faso', 'Germany',
    'United Kingdom', 'Kuwait', 'Canada', 'Argentina', 'Japan',
    'Austria', 'Spain', 'Estonia', 'Hungary', 'Australia', 'Morocco',
    'Greece', 'Qatar', 'Oman', 'Liberia', 'Denmark', 'Malaysia',
    'Jordan', 'Syria', 'Ethiopia', 'Norway', 'Ghana', 'Kazakhstan',
    'Pakistan', 'Gabon', 'United Arab Emirates', 'Algeria', 'Turkey',
    'Cyprus', 'Belize', 'Poland'
  ];

  // Fetch data for BarChart
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8000/barchart/?year=${selectedYearBar}&sector=${selectedSector}/`)
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

  // Fetch data for RadarChart
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8000/radarplot/?topic=${selectedTopic}`)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        console.log("Radar Chart Data:", data); // Debugging
        setRadarChartData(data);
        setLoading(false);
      })
      .catch((error) => setError(error));
  }, [selectedTopic]);

  // Fetch data for PieChart
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8000/piechart/?country=${selectedCountry}`) // Add country filter
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        setPieChartData(data.data || []); // Assuming the API returns { data: [...] }
        setLoading(false);
      })
      .catch((error) => setError(error));
  }, [selectedCountry]); // Re-run effect when selectedCountry changes

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="App">
      <h1>Interactive Charts</h1>

      {/* Bar Chart */}
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

      {/* Line Chart */}
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

      {/* Radar Chart */}
      <Card>
        <div className="card-header">
          <h2>Average Intensity Over Regions</h2>
          <select
            className="topic-select"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value="oil">Oil</option>
            {sectors.map((topic, index) => (
              <option key={index} value={topic}>{topic || 'Uncategorized'}</option>
            ))}
          </select>
        </div>
        {radarChartData && radarChartData.labels.length > 0 && radarChartData.datasets.length > 0 ? (
          <RadarChart data={radarChartData} />
        ) : (
          <div className="error">No data available for Radar Chart</div>
        )}
      </Card>

      {/* Pie Chart */}
      <Card>
        <div className="card-header">
          <h2>Pestle Distribution</h2>
          <select
            className="country-select"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">All Countries</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>{country || 'Uncategorized'}</option>
            ))}
          </select>
        </div>
        {pieChartData.length > 0 ? (
          <PieChart data={pieChartData} />
        ) : (
          <div className="error">No data available for Pie Chart</div>
        )}
      </Card>
    </div>
  );
}

export default App;