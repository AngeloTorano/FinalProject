function validatePatient(req, res, next) {
  const { last_name, first_name, gender, dob } = req.body;
  if (!last_name || !first_name || !gender || !dob) {
    return res.status(400).json({ message: "last_name, first_name, gender, and dob are required." });
  }
  next();
}

module.exports = validatePatient;