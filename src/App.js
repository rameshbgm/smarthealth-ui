import React, { useState, useEffect } from 'react';
import './App.css';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { FaHeartbeat, FaWalking, FaBed, FaFire, FaTint, FaCalendarAlt, FaChartLine, FaClock, FaChartBar, FaSpinner, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

// Sample health data structure - in a real app, this would come from an API
const healthData = [
  {
    name: 'Health Metrics',
    status: 0.95,
    lastCheckTime: Date.now(),
    datapoints: [
      { timestamp: '2025-03-01T08:00:00', value: 0.92 },
      { timestamp: '2025-03-01T12:00:00', value: 0.95 },
      { timestamp: '2025-03-01T16:00:00', value: 0.98 },
      { timestamp: '2025-03-01T20:00:00', value: 0.94 },
      { timestamp: '2025-03-02T00:00:00', value: 0.93 },
      { timestamp: '2025-03-02T04:00:00', value: 0.91 },
      { timestamp: '2025-03-02T08:00:00', value: 0.95 }
    ],
    elements: [
      {
        name: 'Heart Rate',
        status: 0.98,
        datapoints: [
          { timestamp: '2025-03-01T08:00:00', value: 72 },
          { timestamp: '2025-03-01T12:00:00', value: 78 },
          { timestamp: '2025-03-01T16:00:00', value: 82 },
          { timestamp: '2025-03-01T20:00:00', value: 76 },
          { timestamp: '2025-03-02T00:00:00', value: 68 },
          { timestamp: '2025-03-02T04:00:00', value: 64 },
          { timestamp: '2025-03-02T08:00:00', value: 70 }
        ]
      },
      {
        name: 'Steps',
        status: 0.85,
        datapoints: [
          { timestamp: '2025-03-01T08:00:00', value: 1200 },
          { timestamp: '2025-03-01T12:00:00', value: 3500 },
          { timestamp: '2025-03-01T16:00:00', value: 5800 },
          { timestamp: '2025-03-01T20:00:00', value: 8200 },
          { timestamp: '2025-03-02T00:00:00', value: 8500 },
          { timestamp: '2025-03-02T04:00:00', value: 8500 },
          { timestamp: '2025-03-02T08:00:00', value: 9200 }
        ]
      },
      {
        name: 'Sleep',
        status: 0.92,
        datapoints: [
          { timestamp: '2025-03-01T08:00:00', value: 'Good' },
          { timestamp: '2025-03-01T12:00:00', value: 'Good' },
          { timestamp: '2025-03-01T16:00:00', value: 'Good' },
          { timestamp: '2025-03-01T20:00:00', value: 'Moderate' },
          { timestamp: '2025-03-02T00:00:00', value: 'Good' },
          { timestamp: '2025-03-02T04:00:00', value: 'Good' },
          { timestamp: '2025-03-02T08:00:00', value: 'Good' }
        ]
      }
    ]
  }
];

// Helper functions for conditional colors
const getStatusColor = (status) => {
  if (status < 0.6) return '#e74c3c'; // Red
  if (status < 0.8) return '#f39c12'; // Yellow
  return '#27ae60'; // Green
};

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(healthData);
  const [selectedMetric, setSelectedMetric] = useState('Heart Rate');
  const [showDetails, setShowDetails] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [healthSummary, setHealthSummary] = useState(null);

  // Simulate data fetching
  useEffect(() => {
    setLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      setData(healthData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAnalysisRequest = () => {
    setIsAnalyzing(true);
    
    // Simulate API call for health analysis
    setTimeout(() => {
      setHealthSummary({
        summary: {
          heartRate: "Your heart rate has been within normal range over the past 24 hours, with a slight elevation during afternoon activities.",
          steps: "You've reached your daily step goal of 8,000 steps. Great job maintaining your activity level!",
          sleep: "Sleep quality has been consistently good with one moderate period. Your sleep pattern is regular and healthy."
        },
        recommendations: [
          "Continue your current activity level to maintain cardiovascular health",
          "Consider adding some strength training to complement your walking routine",
          "Maintain your consistent sleep schedule for optimal rest"
        ],
        warning: "No significant health concerns detected based on current metrics."
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  if (loading) return <div className="loading">Loading health dashboard...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const selectedMetricData = data[0].elements.find(e => e.name === selectedMetric);
  const chartData = selectedMetricData ? selectedMetricData.datapoints.map(dp => ({
    time: new Date(dp.timestamp).toLocaleTimeString(),
    value: dp.value
  })) : [];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Health Dashboard</h1>
        <div className="current-date">Sunday, March 02, 2025, 11:30 AM</div>
      </header>

      <div className="metrics-overview">
        <h2>Health Metrics Overview</h2>
        <div className="metrics-container">
          {data[0].elements.map(metric => (
            <div 
              key={metric.name} 
              className={`metric-card ${selectedMetric === metric.name ? 'selected' : ''}`}
              onClick={() => setSelectedMetric(metric.name)}
            >
              <div className="status-indicator" style={{ backgroundColor: getStatusColor(metric.status) }}></div>
              <h3>{metric.name}</h3>
              <p>Status: {Math.round(metric.status * 100)}%</p>
            </div>
          ))}
          <div className="metric-card analysis" onClick={handleAnalysisRequest}>
            {isAnalyzing ? (
              <FaSpinner className="icon spinning" />
            ) : (
              <FaChartBar className="icon" />
            )}
            <h3>{isAnalyzing ? "Analyzing..." : "Health Analysis"}</h3>
          </div>
        </div>
      </div>

      {healthSummary && (
        <div className="health-summary">
          <div className="summary-header">
            <h2>Health Summary</h2>
            <button className="close-button" onClick={() => setHealthSummary(null)}>
              <FaTimes />
            </button>
          </div>
          <div className="summary-content">
            <h3>Metrics Analysis</h3>
            <ul>
              {Object.entries(healthSummary.summary).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>
            
            <h3>Recommendations</h3>
            <ol>
              {healthSummary.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ol>
            
            {healthSummary.warning && (
              <div className="warning">
                <FaExclamationTriangle /> {healthSummary.warning}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="metric-details">
        <h2>{selectedMetric} Details</h2>
        <button className="toggle-details" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'Hide Raw Data' : 'View Raw Data'}
        </button>
        
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {showDetails && (
          <div className="raw-data">
            <h3>Raw Data</h3>
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {selectedMetricData.datapoints.map((dp, idx) => (
                  <tr key={idx}>
                    <td>{new Date(dp.timestamp).toLocaleString()}</td>
                    <td>{dp.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer>
        <p>Health Dashboard v1.0 | Last updated: March 2, 2025</p>
      </footer>
    </div>
  );
}

export default App;
