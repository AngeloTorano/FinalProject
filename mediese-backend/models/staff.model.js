const pool = require("../config/db")
const bcrypt = require('bcryptjs')

async function findByUsername(username) {
  const result = await pool.query(
    "SELECT id, staff_id, first_name, last_name, email, username, password_hash, role, status FROM staff_accounts WHERE username = $1 LIMIT 1",
    [username],
  )
  return result.rows[0]
}

async function createUser(userData) {
  const { staff_id, first_name, last_name, email, username, password, role, status } = userData
  const password_hash = await bcrypt.hash(password, 10)
  const result = await pool.query(
    "INSERT INTO staff_accounts (staff_id, first_name, last_name, email, username, password_hash, role, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, staff_id, first_name, last_name, email, username, role, status",
    [staff_id, first_name, last_name, email, username, password_hash, role, status]
  )
  return result.rows[0]
}

async function findById(id) {
  const result = await pool.query(
    "SELECT id, staff_id, first_name, last_name, email, username, role, status FROM staff_accounts WHERE id = $1 LIMIT 1",
    [id],
  )
  return result.rows[0]
}

module.exports = { findByUsername, findById, createUser }
