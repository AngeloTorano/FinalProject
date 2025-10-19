const express = require("express")
const { validateRequest, schemas } = require("../middleware/validation")
const { authenticateToken, requireRole, requireLocationAccess } = require("../middleware/auth")
const Phase2Controller = require("../controllers/phase2Controller")

const router = express.Router()

// All routes require authentication and location access
router.use(authenticateToken)
router.use(requireLocationAccess)

// Phase 2 Registration Section
router.post(
  "/registration",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  validateRequest(schemas.phase2Registration),
  Phase2Controller.createRegistration,
)

router.get(
  "/registration",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  Phase2Controller.getRegistrations,
)

router.put(
  "/registration/:registrationId",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  Phase2Controller.updateRegistration,
)

// Ear Screening--
router.post(
  "/ear-screening",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  validateRequest(schemas.earScreening),
  Phase2Controller.createEarScreening,
)

router.get(
  "/ear-screening",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  Phase2Controller.getEarScreenings,
)

router.put(
  "/ear-screening/:screeningId",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  Phase2Controller.updateEarScreening,
)

// Hearing Screening
router.post(
  "/hearing-screening",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  validateRequest(schemas.hearingScreening),
  Phase2Controller.createHearingScreening,
)

router.get(
  "/hearing-screening",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  Phase2Controller.getHearingScreenings,
)

router.put(
  "/hearing-screening/:screeningId",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  Phase2Controller.updateHearingScreening,
)

// Fitting Table
router.post(
  "/fitting-table",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  validateRequest(schemas.fittingTable),
  Phase2Controller.createFittingTable,
)


router.get(
  "/fitting-table",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  Phase2Controller.getFittingTables,
)

router.put(
  "/fitting-table/:fittingTableId",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  Phase2Controller.updateFittingTable,
)

// Fitting
router.post(
  "/fitting",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  validateRequest(schemas.fitting),
  Phase2Controller.createFitting,
)

router.get(
  "/fitting",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  Phase2Controller.getFittings,
)

router.put(
  "/fitting/:fittingId",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  Phase2Controller.updateFitting,
)

// Counseling
router.post(
  "/counseling",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  validateRequest(schemas.counseling),
  Phase2Controller.createCounseling,
)

router.get(
  "/counseling",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  Phase2Controller.getCounselings,
)

router.put(
  "/counseling/:counselingId",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  Phase2Controller.updateCounseling,
)

// Final QC Phase 2
router.post(
  "/final-qc",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  validateRequest(schemas.finalQCP2),
  Phase2Controller.createFinalQC,
)

router.get(
  "/final-qc",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  Phase2Controller.getFinalQCs,
)

router.put(
  "/final-qc/:qcId",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  Phase2Controller.updateFinalQC,
)

// Get complete Phase 2 data for a patient
router.get(
  "/patient/:patientId",
  requireRole(["Admin", "City Coordinator", "Country Coordinator"]),
  Phase2Controller.getPhase2Data,
)

module.exports = router
