require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors()); // בשלב מאוחר יותר אפשר להגביל ל-origin ספציפי
app.use(express.json());

// Mongo connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("MONGO_URI is not defined in .env");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Mongoose User model
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, enum: ["Active", "Suspended"], default: "Active" },
    oktaStatus: {
      type: String,
      enum: ["Synced", "Pending"],
      default: "Pending", // כשנחבר ל-Okta נהפוך ל-Synced אחרי הצלחה
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// GET /api/users - מחזיר את כל המשתמשים
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.delete("/api/deleteUser/:id", async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});


// POST /api/users - יצירת משתמש חדש
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, role, status } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // כאן בעתיד:
    // 1. נשמור את המשתמש ב-DB (כמו עכשיו)
    // 2. נקרא ל-Okta API ליצור את המשתמש
    // 3. נעדכן את oktaStatus ל-'Synced' אם הצליח

    const newUser = new User({
      name,
      email,
      role,
      status: status || "Active",
      oktaStatus: "Pending",
    });

    const saved = await newUser.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 Backend listening on port ${port}`);
});
