const jwt = require('jsonwebtoken');
const { findByUsername, createUser } = require('../models/staff.model');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');
dotenv.config();

async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Missing credentials' });

    const user = await findByUsername(username);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcryptjs.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { id: user.id, username: user.username, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });

    delete user.password_hash;
    return res.json({ token, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function register(req, res) {
  try {
    const { staff_id, first_name, last_name, email, username, password, role, status } = req.body;
    if (!staff_id || !first_name || !last_name || !email || !username || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if username already exists
    const existingUser = await findByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const newUser = await createUser({ staff_id, first_name, last_name, email, username, password, role, status: status || 'active' });
    delete newUser.password_hash;
    return res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { login, register };
