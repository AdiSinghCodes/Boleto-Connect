const express = require('express');
const pool = require("../db");

const router = express.Router();

// Helper function to validate and parse schedule data
const validateScheduleData = (scheduleData) => {
    try {
        const parsed = typeof scheduleData === 'string' ? JSON.parse(scheduleData) : scheduleData;
        
        const defaultTasks = Array(7).fill().map((_, i) => ({
            id: i + 1,
            details: "",
            completionDay: "",
            duration: "",
            comments: ""
        }));

        return {
            isValid: true,
            data: {
                notes: parsed.notes || {},
                tasks: Array.isArray(parsed.tasks) && parsed.tasks.length === 7 
                    ? parsed.tasks 
                    : defaultTasks
            }
        };
    } catch (error) {
        console.error("Schedule data validation error:", error);
        return { 
            isValid: false, 
            error: "Invalid schedule data format",
            data: {
                notes: {},
                tasks: Array(7).fill().map((_, i) => ({
                    id: i + 1,
                    details: "",
                    completionDay: "",
                    duration: "",
                    comments: ""
                }))
            }
        };
    }
};

// Get user role
router.get("/user-role/:user_id", async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await pool.query(
            "SELECT role FROM users WHERE id = $1",
            [user_id]
        );
        res.json({ role: result.rows[0]?.role || 'employee' });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Route to submit schedule (allows multiple submissions per month)
router.post("/submit", async (req, res) => {
    const { user_id, month, schedule_data } = req.body;

    if (!user_id || !month || !schedule_data) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    const validation = validateScheduleData(schedule_data);
    if (!validation.isValid) {
        return res.status(400).json({ message: validation.error });
    }

    try {
        await pool.query(
            "INSERT INTO schedules (user_id, month, schedule_data, submitted, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)",
            [user_id, month, schedule_data, true]
        );

        return res.status(201).json({ message: "Schedule submitted successfully!" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Fetch user schedules for a specific month
router.get("/user/:user_id", async (req, res) => {
    const { user_id } = req.params;
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ message: "Month parameter is required!" });
    }

    try {
        // Check if requesting user is a boss
        const userRole = await pool.query(
            "SELECT role FROM users WHERE id = $1",
            [user_id]
        );

        const result = await pool.query(
            "SELECT * FROM schedules WHERE user_id = $1 AND month = $2 ORDER BY created_at DESC LIMIT 1",
            [user_id, month]
        );

        if (result.rows.length === 0) {
            return res.json([{
                schedule_data: JSON.stringify({
                    notes: {},
                    tasks: Array(7).fill().map((_, i) => ({
                        id: i + 1,
                        details: "",
                        completionDay: "",
                        duration: "",
                        comments: ""
                    }))
                })
            }]);
        }

        const processedResults = result.rows.map(row => {
            if (row.schedule_data) {
                const validation = validateScheduleData(row.schedule_data);
                row.schedule_data = JSON.stringify(validation.data);
            }
            return row;
        });

        res.json(processedResults);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Fetch all employees' schedules (boss only)
router.get("/all-employees", async (req, res) => {
    const { boss_id } = req.query;

    try {
        // Verify if the requesting user is a boss
        const bossCheck = await pool.query(
            "SELECT role FROM users WHERE id = $1",
            [boss_id]
        );

        if (!bossCheck.rows[0] || bossCheck.rows[0].role !== 'boss') {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const result = await pool.query(
            `SELECT s.*, u.email, u.name 
             FROM schedules s 
             JOIN users u ON s.user_id = u.id 
             WHERE u.role = 'employee' 
             ORDER BY s.created_at DESC`
        );

        const processedResults = result.rows.map(row => {
            if (row.schedule_data) {
                const validation = validateScheduleData(row.schedule_data);
                row.schedule_data = JSON.stringify(validation.data);
            }
            return row;
        });

        res.json(processedResults);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Edit an employee's schedule (boss only)
// Edit an employee's schedule (boss only)
router.put("/edit/:schedule_id", async (req, res) => {
    const { schedule_id } = req.params;
    const { schedule_data, boss_id } = req.body;

    try {
        // Verify if the requesting user is a boss
        const bossCheck = await pool.query(
            "SELECT role FROM users WHERE id = $1",
            [boss_id]
        );

        if (!bossCheck.rows[0] || bossCheck.rows[0].role !== 'boss') {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        // Get the current schedule data before updating
        const currentSchedule = await pool.query(
            "SELECT schedule_data FROM schedules WHERE id = $1",
            [schedule_id]
        );

        const previous_data = currentSchedule.rows[0]?.schedule_data;

        // Update the schedule
        await pool.query(
            "UPDATE schedules SET schedule_data = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
            [schedule_data, schedule_id]
        );

        // Log the edit in schedule_edits table
        await pool.query(
            `INSERT INTO schedule_edits 
             (schedule_id, edited_by, edit_timestamp, previous_data, new_data) 
             VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4)`,
            [schedule_id, boss_id, previous_data, schedule_data]
        );

        res.json({ message: "Schedule updated successfully!" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;