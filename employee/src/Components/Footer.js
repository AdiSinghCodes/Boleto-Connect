import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaGlobe, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-column">
            <h3 className="footer-heading">Contact Us</h3>
            <div className="footer-contact-item">
              <FaMapMarkerAlt className="footer-icon" />
              <p>706, wall street 2 opposite Orient club near Gujarat collage ahemdabad 380006</p>
            </div>
            <div className="footer-contact-item">
              <FaPhone className="footer-icon" />
              <p>+91 97233 01069 / +91 78748 43294</p>
            </div>
            <div className="footer-contact-item">
              <FaEnvelope className="footer-icon" />
              <p>info@boletovadapav.com</p>
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Follow Us</h3>
            <div className="footer-social">
              <a href="https://www.facebook.com/boletovadapav?mibextid=qi2Omg&rdid=3e7NDsQJMAsTqird&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1RdcaMGjtpc1VyPV%2F%3Fmibextid%3Dqi2Omg#" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                <FaFacebook className="footer-social-icon" />
                <span>Facebook</span>
              </a>
              <a href="https://www.instagram.com/boletovadapav/?igsh=MWMyd3RtOXN5Z243cA%3D%3D" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                <FaInstagram className="footer-social-icon" />
                <span>Instagram</span>
              </a>
              <a href="https://boletovadapav.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                <FaGlobe className="footer-social-icon" />
                <span>Website</span>
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/calendar">Calendar</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Boleto Vadapav. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;