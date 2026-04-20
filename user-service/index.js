import dotenv from 'dotenv';
dotenv.config();
import app from './server.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
