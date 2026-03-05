require("dotenv").config(); 
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HTTP = require("../config/httpStatus");

// ================= REGISTER =================
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP.BAD_REQUEST).json({ success: false, message: "Validation failed", data: errors.array() });
    }

    try {
      const { name,email, password } = req.body;
      const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
      if (existing.length > 0) {
        return res.status(HTTP.BAD_REQUEST).json({ success: false, message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.query("INSERT INTO users (name ,email, password) VALUES (?, ?, ?)", [email, hashedPassword]);

      // Generate token immediately after registration
      const token = jwt.sign({ userId: result.insertId, email }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.status(HTTP.CREATED).json({ 
        success: true, 
        message: "User registered successfully", 
        data: { user_id: result.insertId, token }  // send token
      });
    } catch (error) {
      console.error("REGISTER ERROR:", error.message);
      res.status(HTTP.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || "Server Error" });
    }
  }
);

// ================= LOGIN =================
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP.BAD_REQUEST).json({ success: false, message: "Validation failed", data: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

      if (users.length === 0) {
        return res.status(HTTP.UNAUTHORIZED).json({ success: false, message: "Invalid credentials" });
      }

      const user = users[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(HTTP.UNAUTHORIZED).json({ success: false, message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.status(HTTP.OK).json({ success: true, message: "Login successful", data: { token } });
    } catch (error) {
      console.error("LOGIN ERROR:", error.message);
      res.status(HTTP.INTERNAL_SERVER_ERROR).json({ success: false, message: "Server Error" });
    }
  }
);

module.exports = router;