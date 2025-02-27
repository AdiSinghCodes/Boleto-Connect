import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css"; // Importing CSS for styling

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("https://boleto-connect-backend.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        // ✅ Clear any previous session data
        localStorage.removeItem("user");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_schedule");

        // ✅ Store user details in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("user_email", data.user.email);
        localStorage.setItem("user_id", data.user.id);

        console.log("User logged in:", data.user);

        // ✅ Fetch user schedule after login
        await fetchUserSchedule(data.user.id);
      } else {
        setErrorMessage(data.error || "Invalid email or password. Try again!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserSchedule = async (userId) => {
    try {
      const scheduleResponse = await fetch(`https://boleto-connect-backend.onrender.com/api/schedules/user/${userId}`);
      const scheduleData = await scheduleResponse.json();

      if (scheduleResponse.ok) {
        localStorage.setItem("user_schedule", JSON.stringify(scheduleData));
        console.log("Fetched user schedule:", scheduleData);
      } else {
        console.error("Error fetching schedule:", scheduleData.error);
      }
    } catch (error) {
      console.error("Error fetching user schedule:", error);
    } finally {
      // ✅ Redirect to Calendar Page after fetching schedule
      navigate("/calendar");
    }
  };

  return (
    <div className="auth-container login-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome to Boleto Connect</h2>
          <p className="auth-subtitle">Sign in to access your account</p>
        </div>
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="password-options">
              <a href="/forgot-password" className="forgot-password">Forgot password?</a>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="auth-btn login-btn"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        {errorMessage && (
          <div className="message-box error">
            {errorMessage}
          </div>
        )}
        
        <div className="auth-footer">
          <p className="auth-link">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
