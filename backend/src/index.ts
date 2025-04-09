import express from 'express';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get('/quotes', async (req: any, res: any) => {
  const authHeader = req.headers.Authorization;
  if (!authHeader) {
    return res.status(403).json({ message: 'Authorization required'});
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const { rows } = await pool.query('SELECT * FROM quotes');
    return res.json(rows);
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token'});
  }
});

// new users sign up
app.post('/register', async (req: any, res: any) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and pasword are required"})
  }

  const hashedPasword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPasword]
    );
    console.log(result);
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json('Error creating user');
  }
});

app.post('/login', async (req: any, res: any) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).json('Username and password are requred');
  }

  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = result.rows[0];
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials'});
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials'});
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  res.json({ token });
});

app.listen(4000, () => {
  console.log('Server started on port 4000');
});
