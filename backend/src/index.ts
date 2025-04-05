import express from 'express';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get('/quotes', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM quotes');
  res.json(rows);
});

app.listen(4000, () => {
  console.log('Server started on port 4000');
});
