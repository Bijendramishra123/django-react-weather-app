import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = 'http://127.0.0.1:8000/api';

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(`${API_URL}/observations/`);
      setWeatherData(response.data);
      prepareChartData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const prepareChartData = (data) => {
    if (data.length === 0) return;

    const sortedData = [...data].sort((a, b) => 
      new Date(a.observation_time) - new Date(b.observation_time)
    );

    const chartData = {
      labels: sortedData.map(item => 
        new Date(item.observation_time).toLocaleDateString()
      ),
      datasets: [
        {
          label: 'Temperature (°C)',
          data: sortedData.map(item => parseFloat(item.temperature)),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Humidity (%)',
          data: sortedData.map(item => parseFloat(item.humidity)),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    };

    setChartData(chartData);
  };

  const deleteObservation = async (id) => {
    if (window.confirm('Are you sure you want to delete this observation?')) {
      try {
        await axios.delete(`${API_URL}/observations/${id}/`);
        fetchWeatherData();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4">Weather Monitoring Dashboard</h2>
      
      {/* Chart Section */}
      {chartData && (
        <div className="card mb-4">
          <div className="card-header bg-info text-white">
            <h5 className="mb-0">Weather Trends Visualization</h5>
          </div>
          <div className="card-body">
            <div style={{ height: '400px' }}>
              <Line 
                data={chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Temperature & Humidity Trends'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      {weatherData.length > 0 && (
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card text-white bg-primary">
              <div className="card-body">
                <h5 className="card-title">Total Records</h5>
                <p className="card-text display-6">{weatherData.length}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-success">
              <div className="card-body">
                <h5 className="card-title">Avg Temp</h5>
                <p className="card-text display-6">
                  {(weatherData.reduce((sum, item) => sum + parseFloat(item.temperature), 0) / weatherData.length).toFixed(1)}°C
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-warning">
              <div className="card-body">
                <h5 className="card-title">Avg Humidity</h5>
                <p className="card-text display-6">
                  {(weatherData.reduce((sum, item) => sum + parseFloat(item.humidity), 0) / weatherData.length).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-info">
              <div className="card-body">
                <h5 className="card-title">Locations</h5>
                <p className="card-text display-6">
                  {[...new Set(weatherData.map(item => item.location))].length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Recent Weather Observations</h5>
            <button className="btn btn-sm btn-primary" onClick={fetchWeatherData}>
              Refresh Data
            </button>
          </div>
        </div>
        <div className="card-body">
          {weatherData.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No weather data available. Add some observations!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Temperature (°C)</th>
                    <th>Humidity (%)</th>
                    <th>Pressure (hPa)</th>
                    <th>Description</th>
                    <th>Source</th>
                    <th>Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {weatherData.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.location}</strong></td>
                      <td>{parseFloat(item.temperature).toFixed(1)}</td>
                      <td>{parseFloat(item.humidity).toFixed(1)}</td>
                      <td>{item.pressure ? parseFloat(item.pressure).toFixed(1) : 'N/A'}</td>
                      <td>{item.description}</td>
                      <td>
                        <span className={`badge ${item.source === 'api' ? 'bg-success' : 'bg-info'}`}>
                          {item.source}
                        </span>
                      </td>
                      <td>{new Date(item.observation_time).toLocaleString()}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteObservation(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
