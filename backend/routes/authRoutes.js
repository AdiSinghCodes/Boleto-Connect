const express = require("express");
const pool = require("../config/db");
const bcrypt = require("bcryptjs");  // Hashing library
const { createUser, findUserByEmail } = require("../models/User");

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser(name, email, hashedPassword);
    res.status(201).json({ message: "Signup successful", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error signing up", error: error.message });
  }
});

// Login Route (Modified to return user_id)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Fetch user_id along with name and email
    const userData = await pool.query(
      "SELECT user_id, name, email FROM users WHERE email = $1",
      [email]
    );

    if (userData.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { user_id, name } = userData.rows[0];

    res.status(200).json({
      message: "Login successful",
      user: { user_id, name, email },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// Get User ID Route
router.get("/getUser/:email", async (req, res) => {
  const { email } = req.params;  

  try {
      const user = await pool.query(
          "SELECT user_id FROM users WHERE email = $1",
          [email]
      );

      if (user.rows.length === 0) {
          return res.status(404).json({ message: "User not found" });
      }

      res.json({ user_id: user.rows[0].user_id });
  } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
