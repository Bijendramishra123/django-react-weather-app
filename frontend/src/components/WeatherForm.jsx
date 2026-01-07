import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://django-react-weather-app.onrender.com/api';

const WeatherForm = () => {
  const [formData, setFormData] = useState({
    location: '',
    temperature: '',
    humidity: '',
    pressure: '',
    description: '',
    wind_speed: '',
    wind_direction: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${API_URL}/observations/`, formData);
      setSuccess(true);
      setFormData({
        location: '',
        temperature: '',
        humidity: '',
        pressure: '',
        description: '',
        wind_speed: '',
        wind_direction: ''
      });
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding weather data:', error);
      alert('Error adding weather data. Please check the form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h4>Add Weather Observation</h4>
      </div>
      <div className="card-body">
        {success && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Success!</strong> Weather data added successfully.
            <button type="button" className="btn-close" onClick={() => setSuccess(false)}></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Location *</label>
              <input
                type="text"
                className="form-control"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g., New Delhi"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Temperature (°C) *</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                required
                placeholder="e.g., 25.5"
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Humidity (%) *</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                name="humidity"
                value={formData.humidity}
                onChange={handleChange}
                required
                placeholder="e.g., 65.0"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Pressure (hPa)</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                name="pressure"
                value={formData.pressure}
                onChange={handleChange}
                placeholder="e.g., 1013.25"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Sunny, Cloudy, Rainy"
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Wind Speed (m/s)</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                name="wind_speed"
                value={formData.wind_speed}
                onChange={handleChange}
                placeholder="e.g., 5.5"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Wind Direction (degrees)</label>
              <input
                type="number"
                className="form-control"
                name="wind_direction"
                value={formData.wind_direction}
                onChange={handleChange}
                placeholder="0-360"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Weather Observation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WeatherForm;
