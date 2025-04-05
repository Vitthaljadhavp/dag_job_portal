import React from 'react';
import "./Footer.css";
import { FaLinkedinIn, FaTwitter, FaInstagram } from 'react-icons/fa';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
 

const Footer = () => {
  return (

    <footer className="footer">
      <div className="footer-container">
        
        {/* Branding */}
        <div className="footer-section brand">
          <h2>DAG Jobs</h2>
          <p>Empowering careers. Connecting talent with opportunity.</p>
        </div>

        {/* Contact Info */}
        <div className="footer-section contact">
          <h4>Contact</h4>
          <p><FiPhone /> +91 90961 74933</p>
          <p><FiMail /> careers@directadmissionguideline.com</p>
          <p><FiMapPin /> 72, Gol Market, YCM Hospital, Pimpri, Pune</p>
        </div>

        {/* Navigation */}
        <div className="footer-section links">
          <h4>Quick Links</h4>
          <a href="/help">Help Center</a>
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms">Terms & Conditions</a>
        </div>

        {/* Social */}
        <div className="footer-section social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#"><FaLinkedinIn /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 DAG Job Portal. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
