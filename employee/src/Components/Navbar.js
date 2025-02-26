import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";
import logo from "../assets/logo.jpg";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check for motivational message on component mount and at regular intervals
    checkForMotivationalMessage();
    
    // Set up interval to check for message expiration
    const interval = setInterval(checkForMotivationalMessage, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const checkForMotivationalMessage = () => {
    const storedMessage = localStorage.getItem("motivationalMessage");
    const expiryTime = localStorage.getItem("motivationalMessageExpiry");
    
    if (storedMessage && expiryTime) {
      // Check if message is still valid
      if (new Date().getTime() < parseInt(expiryTime)) {
        setMotivationalMessage(storedMessage);
      } else {
        // Message expired, clear it
        localStorage.removeItem("motivationalMessage");
        localStorage.removeItem("motivationalMessageExpiry");
        setMotivationalMessage("");
      }
    } else {
      setMotivationalMessage("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login"); // Redirect to login page
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left: Logo */}
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="Boleto Vadapav Logo" />
          </Link>
        </div>

        {/* Center: System Name and Motivational Message */}
        <div className="navbar-brand">
          <h1>Boleto Connect</h1>
          {motivationalMessage && (
            <div className="motivational-message">
              "{motivationalMessage}"
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="menu-toggle" onClick={toggleMenu}>
          <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Right: Navigation and Buttons */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="navbar-links">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="https://boletovadapav.com/about-us/" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="https://boletovadapav.com/menu-2/" onClick={() => setIsMenuOpen(false)}>Services</Link>
          </div>

          <div className="navbar-auth">
            {!user ? (
              <>
                <Link to="/login" className="nav-button login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="nav-button signup" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="user-menu">
                <span className="welcome-text">Welcome, {user.name}!</span>
                <button className="nav-button logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;