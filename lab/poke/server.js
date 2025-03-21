import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();
const port = 3001;

app.use(express.json());

const db = new sqlite3.Database("database.db", (err) => {
    if (err)
        console.error("Failed to open the database:", err);
    else
        console.log("Coonected to the database.db database.");
});

// GET /api/bowls
// Retrieve the list of all bowls

app.get("/api/bowls", (req, res) => {
    const sql = "SELECT * FROM bowls";
    db.all(sql, [], (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        return res.json(rows);
    });
});

// GET /api/bowls/<id>
// Retrieve a specific bowl by ID

app.get("api/bowls/:id", (req, res) => {
    const bowlId = req.params.id;

    const sql = "SELECT * FROM bowls WHERE id = ?";
    db.get(sql, [bowlId], (err, row) => {
        if (err)
            return res.status(500).json({ error: err.message });
        if (!row)
            return res.status(404).json({ error: "Bowl not found" });
        return res.json(row);
    });
});

// POST api/bowls
// Create a new bowl (auto)