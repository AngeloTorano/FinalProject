const { Pool } = require("pg")
const dotenv = require("dotenv")
dotenv.config()

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER || "postgres",
  password: String(process.env.DB_PASSWORD || "0909"),
  database: process.env.DB_NAME || "mediese_db",
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})
module.exports = pool
