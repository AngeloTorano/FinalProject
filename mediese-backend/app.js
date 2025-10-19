const express = require("express")
const cors = require("cors")
const authRoutes = require("./routes/auth.routes")
const protectedRoutes = require("./routes/protected.routes")
const patientRoutes = require("./routes/patient.routes");
const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

app.use("/api/auth", authRoutes)
app.use("/api", protectedRoutes)
app.use("/api/patients", patientRoutes);

app.get("/", (req, res) =>
  res.json({
    message: "Mediease Backend API",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
  }),
)

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  })
})

app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack)
  res.status(500).json({
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  })
})

module.exports = app
