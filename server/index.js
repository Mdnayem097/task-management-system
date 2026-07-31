require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

connectDB();

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}