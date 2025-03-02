import React, { useState, useEffect } from 'react';
import './App.css';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { FaHeartbeat, FaWalking, FaBed, FaFire, FaTint, FaCalendarAlt, FaChartLine, FaClock, FaChartBar, FaSpinner, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import AnimatedNumbers from 'react-animated-numbers';
import jsonData from './data.json'; // Your JSON file with 15 days (12 records per day)

// Group data by date
const groupedData = jsonData.health_data.reduce((acc, record) => {
  if (!acc[record.date]) acc[record.date] = [];
  acc[record.date].push(record);
  return acc;
}, {});

// Sorted list of dates
const dates = Object.keys(groupedData).sort();

// Helper functions for conditional colors
const getStepsColor = (steps) => {
  if (steps < 500) return '#e74c3c';
  if (steps < 1000) return '#f39c12';
  return '#27ae60';
};

const getCaloriesColor = (calories) => {
  if (calories < 50) return '#e74c3c';
  if (calories < 150) return '#f39c12';
  return '#27ae60';
};

const getOxygenColor = (oxygen) => {
  if (oxygen < 95) return '#e74c3c';
  if (oxygen < 98) return '#f39c12';
  return '#27ae60';
};

const getHeartRateColor = (hr) => {
  if (hr < 60 || hr > 100) return '#e74c3c';
  if (hr <= 80) return '#27ae60';
  return '#f39c12';
};

const getSleepColor = (sleepQuality) => {
  if (sleepQuality === "Poor") return '#e74c3c';
  if (sleepQuality === "Moderate") return '#f39c12';
  if (sleepQuality === "Good") return '#27ae60';
  if (sleepQuality === "Very Good") return '#2980b9';
  return '#333';
};

// Convert sleep quality to numeric value for graphing
const getSleepQualityValue = (quality) => {
  switch(quality) {
    case "Poor": return 1;
    case "Moderate": return 2;
    case "Good": return 3;
    case "Very Good": return 4;
    default: return 0;
  }
};

function App() {
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [healthSummary, setHealthSummary] = useState(null);
  const [showSummary, setShowSummary] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('all'); // Default to show all metrics

  // When date changes, update all data
  const selectedData = groupedData[selectedDate] || [];
  
  // Process data to include sleep values
  const processedData = selectedData.map(record => ({
    ...record,
    sleep_value: getSleepQualityValue(record.sleep_quality)
  }));
  
  const aggregatedSteps = selectedData.reduce((sum, rec) => sum + rec.steps, 0);
  const aggregatedCalories = selectedData.reduce((sum, rec) => sum + rec.calories_burned, 0);
  const avgHeartRate = selectedData.length ? Math.round(selectedData.reduce((sum, rec) => sum + rec.heart_rate, 0) / selectedData.length) : 0;
  const avgOxygen = selectedData.length ? Math.round(selectedData.reduce((sum, rec) => sum + rec.oxygen_saturation, 0) / selectedData.length) : 0;
  const sleepQuality = selectedData.length ? 
    selectedData.reduce((most, record) => {
      return record.sleep_quality ? record.sleep_quality : most;
    }, "Unknown") : '';

  // Calculate totals for each column
  const totalSteps = selectedData.reduce((sum, rec) => sum + rec.steps, 0);
  const totalCalories = selectedData.reduce((sum, rec) => sum + rec.calories_burned, 0);
  const avgOxygenTotal = selectedData.length ? Math.round(selectedData.reduce((sum, rec) => sum + rec.oxygen_saturation, 0) / selectedData.length) : 0;
  const avgHeartRateTotal = selectedData.length ? Math.round(selectedData.reduce((sum, rec) => sum + rec.heart_rate, 0) / selectedData.length) : 0;

  const handleAnalysisRequest = () => {
    setIsAnalyzing(true);
    setHealthSummary(null);
    setShowSummary(true);
    setSelectedMetric('all'); // Reset to show all metrics
    
    const dataToAnalyze = {
      date: selectedDate,
      metrics: {
        steps: aggregatedSteps,
        calories: aggregatedCalories,
        oxygen: avgOxygen,
        heartRate: avgHeartRate,
        sleep: sleepQuality
      },
      details: selectedData,
      userReport: "I have a headache."
    };
    
    // Dummy API call simulation
    console.log("Sending data for analysis:", dataToAnalyze);
    
    // Simulate API response after 3 seconds
    setTimeout(() => {
      // This is the dummy response that would normally come from your API
      const dummyResponse = {
        summary: {
          heartRate: "Your heart rate was slightly elevated around 16:00 (90 bpm) and 18:00 (92 bpm). This may indicate some physical exertion or stress during those periods.",
          bloodPressure: "Blood pressure readings remained within normal to slightly elevated ranges (121/79 to 125/83). Fluctuations could be contributing to your headache.",
          oxygenSaturation: "Oxygen saturation was stable and within the normal range (97%).",
          hydration: "Your hydration levels remained stable but slightly on the lower end (56%-57%). Consider increasing water intake, especially after exercise.",
          sleepQuality: "Sleep quality was mostly good, but moderate during 10:00-12:00. Poor sleep could also contribute to headaches."
        },
        recommendations: [
          "Hydrate More: Your hydration levels are on the lower end, and dehydration is a common headache trigger. Drink more water throughout the day.",
          "Stress Reduction: Try incorporating stress-relief activities like meditation or light stretching. The elevated heart rate in the afternoon could suggest stress or overexertion.",
          "Monitor Blood Pressure: While your blood pressure is within a normal range, fluctuations could contribute to headaches. Monitor regularly, and consider consulting a healthcare provider if you notice a consistent rise.",
          "Sleep Quality: Work on improving sleep hygiene, especially during periods when sleep quality was moderate. Try to maintain a consistent sleep schedule and create a calming bedtime routine."
        ],
        warning: "If the headache persists or becomes more frequent, please consult a healthcare provider to ensure there are no underlying medical conditions."
      };
      
      setHealthSummary(dummyResponse);
      setIsAnalyzing(false);
    }, 3000);
  };

  // Function to handle metric selection
  const handleMetricSelect = (metric) => {
    setSelectedMetric(metric);
  };

  return (
    <div className="App">
      {/* Side Navigation */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? '◀' : '▶'}
        </div>
        <div className="sidebar-content">
          <h3><FaCalendarAlt /> Select Date</h3>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-select"
          >
            {dates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="main-content">
        <header className="App-header">
          <h1>Health Dashboard</h1>
        </header>

        <div className="aggregated-card">
          <div className="metrics">
            <div className={`metric ${selectedMetric === 'all' ? 'active' : ''}`} onClick={() => handleMetricSelect('all')}>
              <FaChartLine className="icon" />
              <div className="label">All Data</div>
            </div>
            <div className={`metric ${selectedMetric === 'steps' ? 'active' : ''}`} onClick={() => handleMetricSelect('steps')}>
              <FaWalking className="icon" />
              <div className="label">Steps</div>
            </div>
            <div className={`metric ${selectedMetric === 'calories' ? 'active' : ''}`} onClick={() => handleMetricSelect('calories')}>
              <FaFire className="icon" />
              <div className="label">Calories</div>
            </div>
            <div className={`metric ${selectedMetric === 'oxygen' ? 'active' : ''}`} onClick={() => handleMetricSelect('oxygen')}>
              <FaTint className="icon" />
              <div className="label">Oxygen</div>
            </div>
            <div className={`metric ${selectedMetric === 'heart_rate' ? 'active' : ''}`} onClick={() => handleMetricSelect('heart_rate')}>
              <FaHeartbeat className="icon" />
              <div className="label">Heart Rate</div>
            </div>
            <div className={`metric ${selectedMetric === 'sleep' ? 'active' : ''}`} onClick={() => handleMetricSelect('sleep')}>
              <FaBed className="icon" />
              <div className="label">Sleep</div>
            </div>
            <div className="metric">
              {isAnalyzing ? (
                <FaSpinner className="icon analyzing-icon" />
              ) : (
                <FaChartBar className="icon summary-icon" onClick={handleAnalysisRequest} />
              )}
              <div className="label">{isAnalyzing ? "Analyzing..." : "Summary"}</div>
            </div>
          </div>
        </div>

        {/* Health Summary Section */}
        {healthSummary && showSummary && (
          <div className="health-summary-card">
            <div className="summary-header">
              <div className="header-content">
                <h2>Health Summary</h2>
                <div className="user-report">User Report: "I have a headache."</div>
              </div>
              <button className="close-button" onClick={() => setShowSummary(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="summary-content">
              <ul className="summary-list">
                <li><strong>Heart Rate:</strong> {healthSummary.summary.heartRate}</li>
                <li><strong>Blood Pressure:</strong> {healthSummary.summary.bloodPressure}</li>
                <li><strong>Oxygen Saturation:</strong> {healthSummary.summary.oxygenSaturation}</li>
                <li><strong>Hydration:</strong> {healthSummary.summary.hydration}</li>
                <li><strong>Sleep Quality:</strong> {healthSummary.summary.sleepQuality}</li>
              </ul>
              
              <h3>Recommendations:</h3>
              <ol className="recommendations-list">
                {healthSummary.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ol>
              
              <div className="warning">
                <FaExclamationTriangle /> {healthSummary.warning}
              </div>
            </div>
          </div>
        )}

        <div className="graph-card">
          <h2>
            <FaHeartbeat className="icon" /> {selectedDate} - Health Metrics Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" orientation="left" stroke="#e74c3c" tick={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#27ae60" tick={false} />
              <Tooltip />
              {(selectedMetric === 'all' || selectedMetric === 'heart_rate') && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="heart_rate"
                  stroke="#e74c3c"
                  activeDot={{ r: 8 }}
                  name="Heart Rate"
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'steps') && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="steps"
                  stroke="#27ae60"
                  name="Steps"
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'calories') && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="calories_burned"
                  stroke="#f39c12"
                  name="Calories"
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'oxygen') && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="oxygen_saturation"
                  stroke="#3498db"
                  name="Oxygen"
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'sleep') && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sleep_value"
                  stroke="#8e44ad"
                  name="Sleep Quality"
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
          <div className="graph-legend">
            {(selectedMetric === 'all' || selectedMetric === 'heart_rate') && (
              <span style={{ color: '#e74c3c' }}>● Heart Rate</span>
            )}
            {(selectedMetric === 'all' || selectedMetric === 'steps') && (
              <span style={{ color: '#27ae60' }}>● Steps</span>
            )}
            {(selectedMetric === 'all' || selectedMetric === 'calories') && (
              <span style={{ color: '#f39c12' }}>● Calories</span>
            )}
            {(selectedMetric === 'all' || selectedMetric === 'oxygen') && (
              <span style={{ color: '#3498db' }}>● Oxygen</span>
            )}
            {(selectedMetric === 'all' || selectedMetric === 'sleep') && (
              <span style={{ color: '#8e44ad' }}>● Sleep</span>
            )}
          </div>
        </div>

        <div className="details-section">
          <div className="details-header">
            <FaChartLine className="details-logo" />
            <h3>Detailed Health Data</h3>
          </div>
          <table className="details-table">
            <thead>
              <tr>
                <th><FaClock /> Time</th>
                <th><FaWalking /> Steps</th>
                <th><FaFire /> Calories</th>
                <th><FaTint /> Oxygen</th>
                <th><FaHeartbeat /> Heart Rate</th>
                <th><FaBed /> Sleep</th>
              </tr>
            </thead>
            <tbody>
              {selectedData.map((record, idx) => (
                <tr key={idx}>
                  <td>{record.time}</td>
                  <td style={{ color: record.steps === 0 ? '#ffffff' : getStepsColor(record.steps) }}>
                    {record.steps === 0 ? '-' : record.steps}
                  </td>
                  <td style={{ color: getCaloriesColor(record.calories_burned) }}>{record.calories_burned}</td>
                  <td style={{ color: getOxygenColor(record.oxygen_saturation) }}>{record.oxygen_saturation}%</td>
                  <td style={{ color: getHeartRateColor(record.heart_rate) }}>{record.heart_rate}</td>
                  <td style={{ color: getSleepColor(record.sleep_quality) }}>{record.sleep_quality}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td><strong>Total</strong></td>
                <td style={{ color: totalSteps === 0 ? '#ffffff' : getStepsColor(totalSteps) }}>
                  <strong>{totalSteps === 0 ? '-' : totalSteps}</strong>
                </td>
                <td style={{ color: getCaloriesColor(totalCalories) }}><strong>{totalCalories}</strong></td>
                <td style={{ color: getOxygenColor(avgOxygenTotal) }}><strong>{avgOxygenTotal}%</strong></td>
                <td style={{ color: getHeartRateColor(avgHeartRateTotal) }}><strong>{avgHeartRateTotal}</strong></td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>

        <footer className="App-footer">
          <p>Built with React, Recharts & React Icons</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
