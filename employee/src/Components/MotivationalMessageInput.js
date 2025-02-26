import React, { useState, useEffect } from "react";
import "./MotivationalMessageInput.css";

const MotivationalMessageInput = () => {
  const [message, setMessage] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    // Load current message if exists
    checkExistingMessage();
    
    // Set up interval to update time remaining
    const interval = setInterval(updateTimeRemaining, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const checkExistingMessage = () => {
    const storedMessage = localStorage.getItem("motivationalMessage");
    const expiryTime = localStorage.getItem("motivationalMessageExpiry");
    
    if (storedMessage && expiryTime) {
      const now = new Date().getTime();
      const expiry = parseInt(expiryTime);
      
      if (now < expiry) {
        setCurrentMessage(storedMessage);
        updateTimeRemaining();
      } else {
        // Message expired, clear it
        localStorage.removeItem("motivationalMessage");
        localStorage.removeItem("motivationalMessageExpiry");
        setCurrentMessage("");
        setTimeRemaining(null);
      }
    } else {
      setCurrentMessage("");
      setTimeRemaining(null);
    }
  };

  const updateTimeRemaining = () => {
    const expiryTime = localStorage.getItem("motivationalMessageExpiry");
    
    if (expiryTime) {
      const now = new Date().getTime();
      const expiry = parseInt(expiryTime);
      
      if (now < expiry) {
        const hoursRemaining = Math.floor((expiry - now) / (1000 * 60 * 60));
        const minutesRemaining = Math.floor(((expiry - now) % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeRemaining(`${hoursRemaining}h ${minutesRemaining}m`);
      } else {
        setTimeRemaining(null);
        checkExistingMessage();
      }
    } else {
      setTimeRemaining(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim() === "") {
      alert("Please enter a motivational message");
      return;
    }
    
    // Set message with 24-hour expiry
    const now = new Date().getTime();
    const expiryTime = now + (24 * 60 * 60 * 1000); // 24 hours from now
    
    localStorage.setItem("motivationalMessage", message);
    localStorage.setItem("motivationalMessageExpiry", expiryTime.toString());
    
    setCurrentMessage(message);
    setMessage("");
    updateTimeRemaining();
  };

  return (
    <div className="motivational-message-container">
      <h3>Today's Motivational Message</h3>
      
      {currentMessage ? (
        <div className="current-message-container">
          <div className="current-message">
            <p>Current message: "{currentMessage}"</p>
            <p className="time-remaining">Time remaining: {timeRemaining}</p>
          </div>
          <button 
            className="clear-message-btn"
            onClick={() => {
              localStorage.removeItem("motivationalMessage");
              localStorage.removeItem("motivationalMessageExpiry");
              setCurrentMessage("");
              setTimeRemaining(null);
            }}
          >
            Clear Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter a motivational message for your team..."
              maxLength={200}
              rows={3}
            />
            <p className="char-count">{message.length}/200</p>
          </div>
          <button type="submit" className="submit-message-btn">Post Message</button>
          <p className="message-note">* This message will be visible to all users for 24 hours</p>
        </form>
      )}
    </div>
  );
};

export default MotivationalMessageInput;