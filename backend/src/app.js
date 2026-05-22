const express = require("express");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const storeRoutes = require("./routes/storeRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

const app = express();


// Middlewares
app.use(cors());
app.use(express.json());


// Health Check Route
app.get("/", (req, res) => {

  res.status(200).json({
    success: true,
    message: "Server Running Successfully"
  });

});


// API Routes
app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/stores", storeRoutes);

app.use("/api/owner", ownerRoutes);


// Global Error Handler
app.use((err, req, res, next) => {

  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });

});


module.exports = app;