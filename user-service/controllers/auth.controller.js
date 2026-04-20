import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db/pool.js';

const register = async (req, res) => {
  try {
    debugger
    const {email, password} = req.body;
    //check if email is valid
    if (!email || !password) return res.status(400).json({error: 'Email and password are required'});
    const hash = await bcrypt.hash(password, 10);
    if (!hash) throw new Error('Hashing failed');

    const result = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email', [email, hash]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({error: 'Email already exists'});
    res.status(500).json({error: `Server error: ${err.message}`});
  }
};

const login = async (req, res) => {
  try {
    const {email, password} = req.body;
    if (!email || !password) return res.status(400).json({error: 'Email and password are required'});

    const result = await pool.query('SELECT id, email, password_hash FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({error: 'User not found'});

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({error: 'Invalid password'});

    const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1d'});
    res.json({token});
  } catch (err) {
    res.status(500).json({error: `Server error: ${err.message}`});
  }
};

export {register, login};
