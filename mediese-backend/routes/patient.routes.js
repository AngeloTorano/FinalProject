const express = require("express");
const router = express.Router();
const controller = require("../controllers/patient.controller");
const validatePatient = require("../middleware/validatePatient");
const { authenticateToken, requireRole } = require("../middleware/auth.middleware"); // If you want to protect these routes

// Uncomment the authenticateToken for protected routes

router.get("/:id", authenticateToken, controller.getPatient);   
router.post("/", authenticateToken, validatePatient, controller.createPatient);
router.put("/:id", authenticateToken, validatePatient, controller.updatePatient);
router.delete("/:id", authenticateToken, controller.deletePatient);

router.get(
  "/",
  authenticateToken,
  requireRole(["Admin", "Country Coordinator"]),
  async (req, res) => {
    try {
      const patients = await Patient.findAll({ where: req.query });
      res.json(patients);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "For admin and country coordinator only" });
    }
  }
);
router.get("/coordinator/:coordinator_id", authenticateToken, controller.getPatientByCoordinator);

module.exports = router;