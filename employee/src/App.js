import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./pages/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import CalendarPage from "./pages/CalendarPage";
import Footer from "./Components/Footer"; // Import Footer

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
      <Footer /> {/* Added Footer */}
    </Router>
  );
}

export default App;
