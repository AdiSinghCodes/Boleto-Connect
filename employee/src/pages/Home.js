import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import vadapav1 from "../assets/vadapav1.jpg"; 
import vadapav2 from "../assets/vadapav2.jpg";
import vadapav3 from "../assets/vadapav3.jpg";
import vadapav4 from "../assets/vadapav4.jpg";

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Boleto Connect</h1>
          <h2>Empowering Workplace Efficiency</h2>
          <div className="hero-action">
            <Link to="/login" className="hero-button primary">Get Started</Link>
            <Link to="https://boletovadapav.com/about-us/" className="hero-button secondary">Learn More</Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="section-header">
            <h2>About Boleto Vadapav</h2>
            <div className="divider"></div>
          </div>
          <div className="about-content">
            <div className="about-text">
              <p>
                Boleto Vadapav, established in 2018, is Gujarat's pioneering fusion Vadapav brand, 
                renowned for elevating the classic Mumbai street food with innovative flavors and 
                high-quality ingredients. By blending traditional tastes with modern culinary twists, 
                Boleto Vadapav offers a unique gastronomic experience that delights food enthusiasts.
              </p>
              <p>
                Introducing <strong>Boleto Connect</strong>, our comprehensive employee management system 
                designed to streamline operations and enhance workplace efficiency. This platform 
                empowers our team to focus on delivering exceptional culinary experiences, ensuring 
                that every customer enjoys the authentic and innovative flavors that define Boleto Vadapav.
              </p>
              <p>
                Experience the fusion of tradition and innovation with Boleto Vadapav, and discover how 
                Boleto Connect is driving our commitment to quality and excellence.
              </p>
            </div>
            <div className="about-image">
              <img src={vadapav4} alt="Boleto Vadapav Specialty" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Boleto Connect Features</h2>
            <div className="divider"></div>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Employee Management</h3>
              <p>Effortlessly manage your team with comprehensive profiles and performance tracking.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3>Smart Scheduling</h3>
              <p>Create and manage shifts with an intuitive calendar that optimizes your workforce.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Performance Analytics</h3>
              <p>Gain valuable insights with detailed performance metrics and customizable reports.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-comments"></i>
              </div>
              <h3>Team Communication</h3>
              <p>Foster collaboration with integrated messaging and announcement features.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Signature Creations</h2>
            <div className="divider"></div>
          </div>
          <div className="gallery-description">
            <p>Experience the fusion of tradition and innovation with our signature Vadapav creations</p>
          </div>
          <div className="image-gallery">
            <div className="gallery-item">
              <div className="gallery-image">
                <img src={vadapav1} alt="Delicious Vadapav" />
                <div className="gallery-overlay">
                  <div className="gallery-info">
                    <h3>Classic Vadapav</h3>
                    <p>Our traditional recipe with a modern twist</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="gallery-item">
              <div className="gallery-image">
                <img src={vadapav2} alt="Fusion Vadapav" />
                <div className="gallery-overlay">
                  <div className="gallery-info">
                    <h3>Fusion Vadapav</h3>
                    <p>Innovative flavors that surprise and delight</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="gallery-item">
              <div className="gallery-image">
                <img src={vadapav3} alt="Signature Vadapav" />
                <div className="gallery-overlay">
                  <div className="gallery-info">
                    <h3>Gourmet Vadapav</h3>
                    <p>Premium ingredients in every bite</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Workplace?</h2>
            <p>Join Boleto Connect today and experience the difference</p>
            <Link to="/signup" className="cta-button">Sign Up Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;