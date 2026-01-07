import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://django-react-weather-app.onrender.com/api';

const ApiIntegration = () => {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(
        `${API_URL}/observations/fetch_from_api/`,
        { city: city.trim() }
      );
      setResult(response.data);
    } catch (error) {
      console.error('Error fetching from API:', error);
      setError(error.response?.data?.error || 'Failed to fetch weather data. Please check API key in backend/.env file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header bg-success text-white">
        <h4>Fetch Weather from OpenWeatherMap API</h4>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <label className="form-label">Enter City Name</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="e.g., London, Delhi, New York, Tokyo"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
            />
            <button
              className="btn btn-primary"
              onClick={fetchWeather}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Fetching...
                </>
              ) : 'Fetch Weather'}
            </button>
          </div>
          <div className="form-text">
            This will fetch real-time weather data from OpenWeatherMap API
          </div>
        </div>

        {error && (
          <div className="alert alert-danger">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="mt-4">
            <h5>Fetched Weather Data:</h5>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>ÔøΩÔøΩ Location:</strong> {result.location}</p>
                    <p><strong>Ìº°Ô∏è Temperature:</strong> {parseFloat(result.temperature).toFixed(1)} ¬∞C</p>
                    <p><strong>Ì≤ß Humidity:</strong> {parseFloat(result.humidity).toFixed(1)} %</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Ì≥ä Pressure:</strong> {result.pressure ? parseFloat(result.pressure).toFixed(1) : 'N/A'} hPa</p>
                    <p><strong>Ì≤® Wind Speed:</strong> {result.wind_speed ? parseFloat(result.wind_speed).toFixed(1) : 'N/A'} m/s</p>
                    <p><strong>ÌæØ Source:</strong> <span className="badge bg-success">{result.source}</span></p>
                  </div>
                </div>
                <div className="mt-2">
                  <p><strong>Description:</strong> {result.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <h5>How it works:</h5>
          <div className="card">
            <div className="card-body">
              <ol className="mb-0">
                <li>Enter any city name in the input field</li>
                <li>Click "Fetch Weather" button</li>
                <li>Data is fetched from OpenWeatherMap API in real-time</li>
                <li>Weather data is automatically saved to the database</li>
                <li>Displayed in dashboard with visualization</li>
              </ol>
            </div>
          </div>
          
          <div className="alert alert-warning mt-3">
            <strong>Important:</strong> You need to add your OpenWeatherMap API key in <code>backend/.env</code> file:
            <pre className="mt-2 mb-0">OPENWEATHER_API_KEY=your_api_key_here</pre>
            <small>Get free API key from: https://openweathermap.org/api</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiIntegration;
