const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db"); // PostgreSQL connection
const scheduleRoutes = require("./routes/scheduleRoutes");

require("dotenv").config();

app.use(cors()); // Allow frontend requests
app.use(express.json()); // Middleware to parse JSON

app.use("/api/schedules", scheduleRoutes);


// ✅ Signup Route (Fixed)
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    // Check if user already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists!" });
    }

    // Insert user into database
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, password]
    );

    res.status(201).json({ message: "User registered successfully!", user: newUser.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Login Route (Already Working)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required!" });
  }

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password!" });
    }

    const user = userResult.rows[0];

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password!" });
    }

    res.json({ message: "Login successful!", user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Server Initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
