const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

const app = express();

// CORS (ONLY ONCE)
app.use(cors({
  origin: "https://your-frontend-url.vercel.app",
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// Test Route (Optional but useful)
app.get("/", (req, res) => {
  res.send("Server running successfully");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});