const pool = require("../config/db");

async function findPhase1Form(search, shf_id, date) {
    const result = await pool.query("")
}

async function getPhase1ById(id) {
    const result = await pool.query("SELECT * FROM WHERE id = $1", [id]);
}