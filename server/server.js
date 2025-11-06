const express = require('express');
require('dotenv').config();
const pool = require('./db.js');

const app = express();

app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ success: true, time: result.rows[0].now });
    } catch (err) {
        console.error('Datenbankfehler:', err);
        res.status(500).json({ success: false, error: err.message || err });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
