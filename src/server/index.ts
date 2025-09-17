import express, { Request, Response } from 'express';
import { PoolConnection } from './sql/connection';
import { getCharacterStat } from './routes/characters';
import { getMonstersHandler } from './routes/monsters/getMonstersHandler';

const app = express();
app.use(express.json());

app.get('/api/character/:id/stat/:statName', /* authorizeCharacterAccess, */ getCharacterStat);
app.get('/api/monsters/:monster/clan', /* authorizeCharacterAccess, */ getMonstersHandler);

app.get('/api/test', async (req, res) => {
  try {
    const pool = PoolConnection.get();
    const client = await pool.connect();
    
    const result = await client.query('SELECT NOW() as current_time');
    client.release();
    
    res.json({ 
      status: 'success', 
      message: 'Database connected', 
      time: result.rows[0].current_time 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: (error as Error).message 
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('Test the connection at: http://localhost:3000/api/test');
});