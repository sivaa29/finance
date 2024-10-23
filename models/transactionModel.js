// models/transactionModel.js
const db = require('../db/database');

module.exports = {
  
  // Add a new transaction
  createTransaction: (transactionData, callback) => {
    const { type, category, amount, date, description } = transactionData;
    const query = `INSERT INTO transactions (type, category, amount, date, description) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [type, category, amount, date, description], function (err) {
      if (err) {
        return callback(err);
      }
      // Return the ID of the newly created transaction
      callback(null, { id: this.lastID });
    });
  },

  // Retrieve all transactions
  getAllTransactions: (callback) => {
    const query = `SELECT * FROM transactions`;
    db.all(query, [], (err, rows) => {
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    });
  },

  // Retrieve a single transaction by ID
  getTransactionById: (id, callback) => {
    const query = `SELECT * FROM transactions WHERE id = ?`;
    db.get(query, [id], (err, row) => {
      if (err) {
        return callback(err);
      }
      if (!row) return callback(new Error("Transaction not found"));
      callback(null, row);
    });
  },

  // Update a transaction by ID
  updateTransaction: (id, updatedData, callback) => {
    const { type, category, amount, date, description } = updatedData;
    const query = `UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ?`;
    db.run(query, [type, category, amount, date, description, id], function (err) {
      if (err) {
        return callback(err);
      }
      if (this.changes === 0) return callback(new Error("Transaction not found"));
      callback(null, { message: "Transaction updated successfully" });
    });
  },

  // Delete a transaction by ID
  deleteTransaction: (id, callback) => {
    const query = `DELETE FROM transactions WHERE id = ?`;
    db.run(query, [id], function (err) {
      if (err) {
        return callback(err);
      }
      if (this.changes === 0) return callback(new Error("Transaction not found"));
      callback(null, { message: "Transaction deleted successfully" });
    });
  },

  // Get summary of income, expenses, and balance
  getTransactionSummary: (callback) => {
    const query = `SELECT type, SUM(amount) AS total FROM transactions GROUP BY type`;
    db.all(query, [], (err, rows) => {
      if (err) {
        return callback(err);
      }

      const summary = { income: 0, expense: 0, balance: 0 };
      rows.forEach(row => {
        if (row.type === 'income') {
          summary.income = row.total;
        } else if (row.type === 'expense') {
          summary.expense = row.total;
        }
      });
      summary.balance = summary.income - summary.expense;
      callback(null, summary);
    });
  }
};