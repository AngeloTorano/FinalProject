const Patient = require("../models/patient.model");

async function getAllPatients(req, res) {
  try {
    const patients = await Patient.findAll(req.query);
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getPatient(req, res) {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function createPatient(req, res) {
  try {
    const patient = await Patient.createPatient(req.body);
    res.status(201).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function updatePatient(req, res) {
  try {
    const updated = await Patient.updatePatient(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Patient not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function deletePatient(req, res) {
  try {
    await Patient.deletePatient(req.params.id);
    res.json({ message: "Patient deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getPatientByCoordinator(req, res) {
  try {
    const { coordinator_id } = req.params;

    // Example using Sequelize
    const patients = await Patient.getPatientByCoordinator({
      where: { coordinator_id }
    });

    if (!patients || patients.length === 0) {
      return res.status(404).json({ message: "No patients found in this Coordinator" });
    }

    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


module.exports = {
  getAllPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientByCoordinator
};