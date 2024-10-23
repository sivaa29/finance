// routes/transactions.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Route for handling transaction CRUD
router.post('/', transactionController.createTransaction);  // Add transaction
router.get('/', transactionController.getTransactions);     // Get all transactions
router.get('/:id', transactionController.getTransactionById);  // Get a specific transaction by ID
router.put('/:id', transactionController.updateTransaction);   // Update a transaction
router.delete('/:id', transactionController.deleteTransaction);  // Delete a transaction
router.get('/summary', transactionController.getSummary);    // Get summary of transactions

module.exports = router;