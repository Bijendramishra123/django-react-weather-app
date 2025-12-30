import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import WeatherDashboard from './components/WeatherDashboard';
import WeatherForm from './components/WeatherForm';
import ApiIntegration from './components/ApiIntegration';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
          <div className="container">
            <Link className="navbar-brand" to="/">
              í¼¤ Weather Monitor
            </Link>
            <div className="navbar-nav">
              <Link className="nav-link" to="/">Dashboard</Link>
              <Link className="nav-link" to="/add">Add Weather</Link>
              <Link className="nav-link" to="/api">API Fetch</Link>
            </div>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<WeatherDashboard />} />
            <Route path="/add" element={<WeatherForm />} />
            <Route path="/api" element={<ApiIntegration />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
