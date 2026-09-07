const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const seed = require('./seed');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'BYTECART Unified Backend',
    timestamp: new Date().toISOString()
  });
});

// Run Seed and Start Server
seed().then(() => {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`✓ BYTECART Backend Server running on port ${PORT}`);
    console.log(`✓ Unified Single Source of Truth initialized`);
    console.log(`===============================================`);
  });
});
