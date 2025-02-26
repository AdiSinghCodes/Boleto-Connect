import React, { useState, useEffect } from "react";
import { FaRegStickyNote } from "react-icons/fa";
import Button from "../Components/ui/button";
import "../pages/CalendarPage.css";
import jsPDF from "jspdf";
import axios from "axios";

const CalendarPage = () => {
  const [notes, setNotes] = useState({});
  const [inputVisible, setInputVisible] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const currentYear = new Date().getFullYear();
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const daysInMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, selectedMonth, 1).getDay();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (!user_id) return;
    setLoading(true);
    setError("");

    fetch(`http://localhost:5000/api/schedules/user/${user_id}?month=${months[selectedMonth]}`)
      .then((response) => response.json())
      .then((data) => {
        setNotes(
          data.length > 0 && data[0].schedule_data 
            ? JSON.parse(data[0].schedule_data) 
            : {}
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching schedule:", error);
        setError("Failed to fetch schedule.");
        setLoading(false);
      });
  }, [user_id, selectedMonth]);

  const handleNoteClick = (day) => {
    setInputVisible(day);
    setNewNote(notes?.[day] || "");
  };

  const handleNoteSave = (day) => {
    if (notes[day] !== newNote) {
      setNotes((prevNotes) => ({ ...prevNotes, [day]: newNote }));
    }
    setInputVisible(null);
  };

  const handleSubmit = async () => {
    if (!user_id) {
      alert("User ID not found. Please log in again.");
      return;
    }
    if (Object.keys(notes).length === 0) {
      alert("No notes to submit!");
      return;
    }

    try {
      const userEmail = localStorage.getItem("user_email");
      const scheduleData = {
        user_id,
        email: userEmail,
        month: months[selectedMonth],
        schedule_data: JSON.stringify(notes),
      };

      const submitResponse = await fetch("http://localhost:5000/api/schedules/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleData),
      });

      const result = await submitResponse.json();
      alert(result.message);

      if (!submitResponse.ok) {
        console.error("Error submitting schedule:", result);
      }
    } catch (error) {
      console.error("Error submitting schedule:", error);
      alert("An error occurred while submitting the schedule.");
    }
  };

  const downloadSchedule = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text(`📅 ${months[selectedMonth]} ${currentYear} Schedule`, 10, 10);
    
    let y = 20;
    Object.entries(notes || {}).forEach(([day, note]) => {
      doc.setFont("helvetica", "normal");
      const wrappedText = doc.splitTextToSize(`Day ${day}: ${note}`, 180);
      doc.text(wrappedText, 10, y);
      y += wrappedText.length * 6;
    });
    
    doc.save(`schedule_${months[selectedMonth]}_${currentYear}.pdf`);
  };

  return (
    <div className="calendar-container">
      <h2 className="calendar-title">📅 {months[selectedMonth]} {currentYear} Schedule</h2>
      <select
        className="month-selector"
        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        value={selectedMonth}
      >
        {months.map((month, index) => (
          <option key={index} value={index}>{month}</option>
        ))}
      </select>

      {loading && <p>Loading schedule...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="calendar-weekdays">
        {weekdays.map((day) => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {[...Array(firstDayOfMonth)].map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty"></div>
        ))}
        {[...Array(daysInMonth)].map((_, i) => (
          <div key={i} className="calendar-day">
            <span className="day-number">{i + 1}</span>
            <FaRegStickyNote className="note-icon" onClick={() => handleNoteClick(i + 1)} />
            {inputVisible === i + 1 ? (
              <div className="note-input-container">
                <textarea
                  className="note-input"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter note..."
                />
                <button className="save-btn" onClick={() => handleNoteSave(i + 1)}>Save</button>
              </div>
            ) : (
              notes[i + 1] && <p className="note-text">{notes[i + 1]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="button-container">
        <Button onClick={handleSubmit} className="submit-btn">Submit</Button>
        <Button onClick={downloadSchedule} className="download-btn">Download Schedule</Button>
      </div>
    </div>
  );
};

export default CalendarPage;
