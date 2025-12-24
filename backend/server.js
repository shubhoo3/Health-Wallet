require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { initializeDatabase, closeDatabase } = require("./config/database");


const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const vitalRoutes = require("./routes/vitalRoutes");
const shareRoutes = require("./routes/shareRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
const PORT = process.env.PORT || 5000;



const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://health-wallet-chi.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.options("*", cors());



app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Uploads directory created");
}

initializeDatabase();

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/vitals", vitalRoutes);
app.use("/api/share", shareRoutes);
app.use("/api/dashboard", dashboardRoutes);



app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Health Wallet API is running",
    timestamp: new Date().toISOString()
  });
});



app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Health Wallet API",
    backend: "https://health-wallet-vusd.onrender.com",
    version: "1.0.0"
  });
});



app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  res.status(err.status || 500).json({
    error: err.message || "Internal server error"
  });
});



app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Backend URL: https://health-wallet-vusd.onrender.com`);
  console.log(`🏥 Health: /api/health`);
});



process.on("SIGINT", () => {
  console.log("\n⏳ Shutting down server...");
  closeDatabase(() => {
    console.log("✅ Database closed");
    process.exit(0);
  });
});

module.exports = app;
