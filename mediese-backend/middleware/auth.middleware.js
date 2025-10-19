const jwt = require("jsonwebtoken")
const { findById } = require("../models/staff.model")

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Access token required" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret")
    const user = await findById(decoded.id)

    if (!user) {
      return res.status(401).json({ message: "Invalid token" })
    }

    if (user.status !== "active") {
      return res.status(401).json({ message: "Account is not active" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    return res.status(403).json({ message: "Invalid or expired token" })
  }
}

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" })
    }

    next()
  }
}

module.exports = { authenticateToken, requireRole }
