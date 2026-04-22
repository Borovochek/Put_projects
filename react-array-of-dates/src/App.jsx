import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { JSPage } from './pages/JSPage';
import { ConverterPage } from './pages/ConverterPage';
import { OtherPage } from './pages/OtherPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { LoginPage } from './pages/LoginPage';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuth') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuth');
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Header onLogout={handleLogout} />
      <div className="app-main">
        <div className="app-sidebar">
          <Sidebar />
        </div>
        <div className="app-content">
          <Routes>
            <Route path="/" element={<JSPage />} />
            <Route path="/converter" element={<ConverterPage />} />
            <Route path="/other" element={<OtherPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
