// app.js
const express = require('express');
const bodyParser = require('body-parser');
const transactionRoutes = require('./routes/transactions');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Routes
app.use('/transactions', transactionRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
