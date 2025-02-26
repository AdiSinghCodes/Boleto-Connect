import React, { useState, useEffect } from "react";
import { FaRegStickyNote, FaCalendarAlt, FaTasks, FaDownload, FaUserCog } from "react-icons/fa";
import Button from "../Components/ui/button";
import "../pages/CalendarPage.css";
import jsPDF from "jspdf";
import MotivationalMessageInput from "../Components/MotivationalMessageInput";

const CalendarPage = () => {
  // All state variables defined at the top
  const [notes, setNotes] = useState({});
  const [tasks, setTasks] = useState([
    { id: 1, details: "", completionDay: "", duration: "", comments: "" },
    { id: 2, details: "", completionDay: "", duration: "", comments: "" },
    { id: 3, details: "", completionDay: "", duration: "", comments: "" },
    { id: 4, details: "", completionDay: "", duration: "", comments: "" },
    { id: 5, details: "", completionDay: "", duration: "", comments: "" },
    { id: 6, details: "", completionDay: "", duration: "", comments: "" },
    { id: 7, details: "", completionDay: "", duration: "", comments: "" },
  ]);
  const [inputVisible, setInputVisible] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isBoss, setIsBoss] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const currentYear = new Date().getFullYear();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, selectedMonth, 1).getDay();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const user_id = localStorage.getItem("user_id");

  // Check if user is boss and fetch employees if they are
  useEffect(() => {
    const checkIfBoss = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/schedules/user-role/${user_id}`);
        const data = await response.json();
        if (data.role === 'boss') {
          setIsBoss(true);
          fetchEmployees();
        }
      } catch (error) {
        console.error("Error checking user role:", error);
      }
    };

    checkIfBoss();
  }, [user_id]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/schedules/all-employees?boss_id=${user_id}`);
      const data = await response.json();
      const uniqueEmployees = [...new Set(data.map(schedule => schedule.user_id))].map(id => {
        const employeeData = data.find(schedule => schedule.user_id === id);
        return {
          id: employeeData.user_id,
          name: employeeData.name,
          email: employeeData.email
        };
      });
      setEmployees(uniqueEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Fetch schedule data
  const fetchScheduleData = async () => {
    if (!user_id) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    try {
      const targetUserId = selectedEmployee || user_id;
      const response = await fetch(
        `http://localhost:5000/api/schedules/user/${targetUserId}?month=${months[selectedMonth]}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.length > 0 && data[0].schedule_data) {
        const parsedData = JSON.parse(data[0].schedule_data);
        setNotes(parsedData.notes || {});
        if (parsedData.tasks && Array.isArray(parsedData.tasks) && parsedData.tasks.length === 7) {
          setTasks(parsedData.tasks);
        }
      } else {
        setNotes({});
        setTasks(tasks.map(task => ({
          ...task,
          details: "",
          completionDay: "",
          duration: "",
          comments: ""
        })));
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
      setError("Failed to fetch schedule. Please try again.");
    } finally {
      setLoading(false);
      setDataLoaded(true);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchScheduleData();
  }, [user_id, selectedMonth, selectedEmployee]);

  const handleNoteClick = (day) => {
    setInputVisible(day);
    setNewNote(notes?.[day] || "");
  };

  const handleNoteSave = (day) => {
    const updatedNotes = { ...notes, [day]: newNote };
    setNotes(updatedNotes);
    setInputVisible(null);
  };

  const handleTaskEdit = (taskId) => {
    setEditingTask(taskId);
  };

  const handleTaskSave = (taskId, field, value) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, [field]: value } : task
    );
    setTasks(updatedTasks);
  };

  const handleTaskSubmit = (taskId) => {
    setEditingTask(null);
  };

  const handleSubmit = async () => {
    if (!user_id) {
      alert("User ID not found. Please log in again.");
      return;
    }

    try {
      const scheduleData = {
        user_id: selectedEmployee || user_id,
        month: months[selectedMonth],
        schedule_data: JSON.stringify({
          notes,
          tasks
        }),
      };

      // Get schedule ID if editing
      let scheduleId;
      if (isBoss && selectedEmployee) {
        const response = await fetch(
          `http://localhost:5000/api/schedules/user/${selectedEmployee}?month=${months[selectedMonth]}`
        );
        const data = await response.json();
        scheduleId = data[0]?.id;
      }

      const endpoint = isBoss && selectedEmployee && scheduleId ? 
        `http://localhost:5000/api/schedules/edit/${scheduleId}` :
        "http://localhost:5000/api/schedules/submit";

      const method = isBoss && selectedEmployee && scheduleId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...scheduleData,
          boss_id: isBoss ? user_id : undefined
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(isBoss && selectedEmployee ? "Schedule updated successfully!" : "Schedule submitted successfully!");
        fetchScheduleData(); // Refresh the data after submission
      } else {
        throw new Error(result.message || "Failed to submit schedule");
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

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Tasks:", 10, y);
    y += 10;

    tasks.forEach((task) => {
      doc.setFont("helvetica", "normal");
      const taskText = doc.splitTextToSize(
        `Task ${task.id}:\nDetails: ${task.details}\nCompletion Day: ${task.completionDay}\nDuration: ${task.duration}\nComments: ${task.comments}`,
        180
      );
      doc.text(taskText, 10, y);
      y += taskText.length * 6 + 5;
    });
    
    doc.save(`schedule_${months[selectedMonth]}_${currentYear}.pdf`);
  };

  const renderTaskBox = (task) => (
    <div key={task.id} className="task-box">
      <div className="task-header">
        <h3>Task {task.id}</h3>
        {editingTask !== task.id && (
          <button 
            className="edit-task-btn" 
            onClick={() => handleTaskEdit(task.id)}
          >
            Edit
          </button>
        )}
      </div>
      {editingTask === task.id ? (
        <div className="task-edit-form">
          <div className="task-field">
            <label>Details:</label>
            <input
              type="text"
              value={task.details}
              onChange={(e) => handleTaskSave(task.id, "details", e.target.value)}
              placeholder="Enter task details"
            />
          </div>
          <div className="task-field">
            <label>Completion Day:</label>
            <input
              type="text"
              value={task.completionDay}
              onChange={(e) => handleTaskSave(task.id, "completionDay", e.target.value)}
              placeholder="Enter completion day"
            />
          </div>
          <div className="task-field">
            <label>Duration:</label>
            <input
              type="text"
              value={task.duration}
              onChange={(e) => handleTaskSave(task.id, "duration", e.target.value)}
              placeholder="Enter duration"
            />
          </div>
          <div className="task-field">
            <label>Comments:</label>
            <textarea
              value={task.comments}
              onChange={(e) => handleTaskSave(task.id, "comments", e.target.value)}
              placeholder="Enter comments"
            />
          </div>
          <button className="save-task-btn" onClick={() => handleTaskSubmit(task.id)}>Save</button>
        </div>
      ) : (
        <div className="task-display">
          <div className="task-info">
            <p><strong>Details:</strong> {task.details || "No details added"}</p>
            <p><strong>Completion Day:</strong> {task.completionDay || "Not set"}</p>
            <p><strong>Duration:</strong> {task.duration || "Not set"}</p>
            <p><strong>Comments:</strong> {task.comments || "No comments"}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="calendar-page">
      {!dataLoaded ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your schedule...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <div className="error-icon">❌</div>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchScheduleData}>Retry</button>
        </div>
      ) : (
        <>
          <div className="calendar-header">
            <h1 className="calendar-title">
              <FaCalendarAlt className="header-icon" /> 
              {months[selectedMonth]} {currentYear} Schedule
            </h1>
            
            <div className="header-controls">
              <div className="select-container">
                <select
                  className="month-selector"
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  value={selectedMonth}
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>
              </div>
              
              {/* Boss View: Employee Selector */}
              {isBoss && (
                <div className="select-container employee-select">
                  <FaUserCog className="select-icon" />
                  <select
                    value={selectedEmployee || ""}
                    onChange={(e) => setSelectedEmployee(e.target.value || null)}
                    className="employee-dropdown"
                  >
                    <option value="">My Schedule</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
          
          {/* Boss-only Motivational Message Input */}
          {isBoss && !selectedEmployee && (
            <div className="motivational-message-container">
              <MotivationalMessageInput />
            </div>
          )}
          
          <div className="calendar-section">
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
                <div key={i} className={`calendar-day ${new Date().getDate() === i + 1 && new Date().getMonth() === selectedMonth ? 'today' : ''}`}>
                  <div className="day-header">
                    <span className="day-number">{i + 1}</span>
                    <FaRegStickyNote 
                      className="note-icon" 
                      onClick={() => handleNoteClick(i + 1)} 
                    />
                  </div>
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
          </div>

          <div className="tasks-section">
            <h2 className="section-title">
              <FaTasks className="section-icon" /> Monthly Tasks
            </h2>
            <div className="tasks-grid">
              {tasks.map(task => renderTaskBox(task))}
            </div>
          </div>

          <div className="actions-section">
            <Button onClick={handleSubmit} className="primary-btn submit-btn">
              {isBoss && selectedEmployee ? "Update Schedule" : "Submit Schedule"}
            </Button>
            <Button onClick={downloadSchedule} className="secondary-btn download-btn">
              <FaDownload className="btn-icon" /> Download Schedule
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarPage;