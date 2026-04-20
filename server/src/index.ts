import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import evaluateRouter from './routes/evaluate.js';

dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use('/api', evaluateRouter);

app.get('/', (_req, res) => {
  res.send({ status: 'server running' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
