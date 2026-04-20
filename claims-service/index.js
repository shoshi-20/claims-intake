import dotenv from 'dotenv';
dotenv.config();
import app from './server.js';

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Claims service running on port ${PORT}`);
});
