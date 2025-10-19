const express = require("express")
const router = express.Router()
const { authenticateToken, requireRole } = require("../middleware/auth.middleware")

router.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "Profile data",
    user: {
      id: req.user.id,
      staff_id: req.user.staff_id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      username: req.user.username,
      role: req.user.role,
      status: req.user.status,
    },
  })
})

router.get("/admin/users", authenticateToken, requireRole(["admin"]), (req, res) => {
  res.json({
    message: "Admin users data",
    note: "This endpoint requires admin role",
  })
})

module.exports = router
