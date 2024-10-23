const db = require('../db/database');

// Add a new transaction
exports.createTransaction = (req, res) => {
  const { type, category, amount, date, description } = req.body;

  const query = `INSERT INTO transactions (type, category, amount, date, description) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [type, category, amount, date, description], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
};

// Get all transactions
exports.getTransactions = (req, res) => {
  const query = `SELECT * FROM transactions`;
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
};

// Get a transaction by ID
exports.getTransactionById = (req, res) => {
  const query = `SELECT * FROM transactions WHERE id = ?`;
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json(row);
  });
};

// Update a transaction by ID
exports.updateTransaction = (req, res) => {
  const { type, category, amount, date, description } = req.body;
  const query = `UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ?`;

  db.run(query, [type, category, amount, date, description, req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json({ message: "Transaction updated successfully" });
  });
};

// Delete a transaction by ID
exports.deleteTransaction = (req, res) => {
  const query = `DELETE FROM transactions WHERE id = ?`;

  db.run(query, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0)  return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json({ message: "Transaction deleted successfully" });
  });
};

// Get summary of transactions (total income, expenses, balance)
exports.getSummary = (req, res) => {
  const query = `SELECT type, SUM(amount) as total FROM transactions GROUP BY type`;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
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
    res.status(200).json(summary);
  });
};