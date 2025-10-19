const pool = require("../config/db");

// Find all, with optional filters (search, gender, employment)
async function findAll({ search, gender, employment }) {
  let sql = `SELECT * FROM patients WHERE 1=1`;
  const params = [];

  if (search) {
    sql += ` AND (LOWER(last_name) LIKE $${params.length+1} OR LOWER(first_name) LIKE $${params.length+1} OR LOWER(shf_id) LIKE $${params.length+1})`;
    params.push(`%${search.toLowerCase()}%`);
  }
  if (gender && gender !== "All Genders") {
    sql += ` AND gender = $${params.length+1}`;
    params.push(gender);
  }
  if (employment && employment !== "All Employment") {
    if (employment === "CURRENT STUDENT") {
      sql += ` AND is_student = true`;
    } else {
      sql += ` AND employment_status = $${params.length+1}`;
      params.push(employment);
    }
  }

  sql += " ORDER BY id DESC";
  const result = await pool.query(sql, params);
  return result.rows;
}

async function findById(id) {
  const result = await pool.query("SELECT * FROM patients WHERE id = $1", [id]);
  return result.rows[0];
}

async function createPatient(data) {
  const {
    last_name,
    first_name,
    gender,
    dob,
    age,
    mobile_number,
    alternative_number,
    region_district,
    city_village,
    employment_status,
    highest_education,
    is_student,
    school_name,
    school_phone_number,
    coordinator_id
  } = data;

  // 🔹 Generate SHF ID (format: SHF-YYYY###)
  const year = new Date().getFullYear();

  // Get the latest patient entry to increment ID number
  const latest = await pool.query(`
    SELECT shf_id 
    FROM patients 
    WHERE shf_id LIKE $1 
    ORDER BY shf_id DESC 
    LIMIT 1
  `, [`SHF-${year}%`]);

  let nextNumber = 1;

  if (latest.rows.length > 0) {
    // Extract the numeric part (e.g., from "SHF-2025001" get "001")
    const lastShfId = latest.rows[0].shf_id;
    const match = lastShfId.match(/PH-SHF-\d{4}(\d+)/);
    if (match) nextNumber = parseInt(match[1]) + 1;
  }

  const newShfId = `PH-SHF-${year}${String(nextNumber).padStart(3, "0")}`;

  // 🔹 Insert new patient record
  const result = await pool.query(
    `INSERT INTO patients (
      shf_id, last_name, first_name, gender, dob, age, mobile_number, alternative_number,
      region_district, city_village, employment_status, highest_education, is_student,
      school_name, school_phone_number, coordinator_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
    RETURNING *`,
    [
      newShfId,
      last_name,
      first_name,
      gender,
      dob || null,
      age || null,
      mobile_number || null,
      alternative_number || null,
      region_district || null,
      city_village || null,
      employment_status || null,
      highest_education || null,
      is_student === true,
      school_name || null,
      school_phone_number || null,
      coordinator_id
    ]
  );

  return result.rows[0];
}

async function updatePatient(id, data) {
  const {
    last_name,
    first_name,
    gender,
    dob,
    age,
    mobile_number,
    alternative_number,
    region_district,
    city_village,
    employment_status,
    highest_education,
    is_student,
    school_name,
    school_phone_number
  } = data;

  const result = await pool.query(
    `UPDATE patients SET
      last_name = $1,
      first_name = $2,
      gender = $3,
      dob = $4,
      age = $5,
      mobile_number = $6,
      alternative_number = $7,
      region_district = $8,
      city_village = $9,
      employment_status = $10,
      highest_education = $11,
      is_student = $12,
      school_name = $13,
      school_phone_number = $14
    WHERE id = $15
    RETURNING *`,
    [
      last_name,
      first_name,
      gender,
      dob || null,
      age || null,
      mobile_number || null,
      alternative_number || null,
      region_district || null,
      city_village || null,
      employment_status || null,
      highest_education || null,
      is_student === true,
      school_name || null,
      school_phone_number || null,
      id
    ]
  );
  return result.rows[0];
}

async function deletePatient(id) {
  await pool.query("DELETE FROM patients WHERE id = $1", [id]);
}

async function getPatientByCoordinator(coordinator_id) {
  const result = await pool.query(
    `SELECT * FROM patients WHERE coordinator_id = $1 ORDER BY id DESC`,
    [coordinator_id]
  );
  return result.rows;
}

module.exports = {
  findAll,
  findById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientByCoordinator
};