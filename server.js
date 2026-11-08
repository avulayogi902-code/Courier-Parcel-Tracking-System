const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'courier_db'
});

// Database Connection
db.connect((err) => {
    if (err) {
        console.log('Database Connection Failed:', err.message);
    } else {
        console.log('MySQL Database Connected Successfully!');
    }
});

// Home Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// ======================================
// CUSTOMER CRUD
// ======================================

// GET CUSTOMERS
app.get('/api/customers', (req, res) => {
    db.query('SELECT * FROM customers', (err, result) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(result);
    });
});

// ADD CUSTOMER
app.post('/api/customers', (req, res) => {
    const { name, email, address } = req.body;

    const sql = 'INSERT INTO customers (name, email, address) VALUES (?, ?, ?)';

    db.query(sql, [name, email, address], (err, result) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        res.json({
            message: 'Customer Added Successfully',
            id: result.insertId
        });
    });
});

// UPDATE CUSTOMER
app.put('/api/customers/:id', (req, res) => {
    const { name, email, address } = req.body;

    const sql = 'UPDATE customers SET name=?, email=?, address=? WHERE customer_id=?';

    db.query(sql, [name, email, address, req.params.id], (err, result) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        res.json({ message: 'Customer Updated Successfully' });
    });
});

// DELETE CUSTOMER
app.delete('/api/customers/:id', (req, res) => {
    const sql = 'DELETE FROM customers WHERE customer_id=?';

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        res.json({ message: 'Customer Deleted Successfully' });
    });
});


// ======================================
// PARCEL CRUD
// ======================================

// GET PARCELS
app.get('/api/parcels', (req, res) => {
    db.query('SELECT * FROM parcels', (err, result) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        res.json(result);
    });
});

// ADD PARCEL
app.post('/api/parcels', (req, res) => {
    const {
        customer_id,
        sender_address,
        receiver_name,
        receiver_phone,
        receiver_address,
        weight,
        booking_date,
        status
    } = req.body;

    const sql = `
        INSERT INTO parcels
        (customer_id, sender_address, receiver_name, receiver_phone,
        receiver_address, weight, booking_date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        customer_id,
        sender_address,
        receiver_name,
        receiver_phone,
        receiver_address,
        weight,
        booking_date,
        status
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        res.json({
            message: 'Parcel Added Successfully',
            id: result.insertId
        });
    });
});

// UPDATE PARCEL
app.put('/api/parcels/:id', (req, res) => {
    const {
        customer_id,
        sender_address,
        receiver_name,
        receiver_phone,
        receiver_address,
        weight,
        booking_date,
        status
    } = req.body;

    const sql = `
        UPDATE parcels
        SET customer_id = ?,
            sender_address = ?,
            receiver_name = ?,
            receiver_phone = ?,
            receiver_address = ?,
            weight = ?,
            booking_date = ?,
            status = ?
        WHERE parcel_id = ?
    `;

    const values = [
        customer_id,
        sender_address,
        receiver_name,
        receiver_phone,
        receiver_address,
        weight,
        booking_date,
        status,
        req.params.id
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        res.json({ message: 'Parcel Updated Successfully' });
    });
});

// DELETE PARCEL
app.delete('/api/parcels/:id', (req, res) => {
    const sql = 'DELETE FROM parcels WHERE parcel_id=?';

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        res.json({ message: 'Parcel Deleted Successfully' });
    });
});


// ======================================
// TRACKING CRUD
// ======================================

// GET TRACKING
app.get('/api/tracking', (req, res) => {
    db.query('SELECT * FROM tracking', (err, result) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        res.json(result);
    });
});

// ADD TRACKING
app.post('/api/tracking', (req, res) => {
    const {
        parcel_id,
        current_location,
        tracking_status,
        updated_date,
        updated_time,
        remarks
    } = req.body;

    const sql = `
        INSERT INTO tracking
        (parcel_id, current_location, tracking_status,
        updated_date, updated_time, remarks)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        parcel_id,
        current_location,
        tracking_status,
        updated_date,
        updated_time,
        remarks
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        res.json({
            message: 'Tracking Details Added Successfully',
            id: result.insertId
        });
    });
});

// UPDATE TRACKING
app.put('/api/tracking/:id', (req, res) => {
    const {
        parcel_id,
        current_location,
        tracking_status,
        updated_date,
        updated_time,
        remarks
    } = req.body;

    const sql = `
        UPDATE tracking
        SET parcel_id = ?,
            current_location = ?,
            tracking_status = ?,
            updated_date = ?,
            updated_time = ?,
            remarks = ?
        WHERE tracking_id = ?
    `;

    const values = [
        parcel_id,
        current_location,
        tracking_status,
        updated_date,
        updated_time,
        remarks,
        req.params.id
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        res.json({ message: 'Tracking Details Updated Successfully' });
    });
});

// DELETE TRACKING
app.delete('/api/tracking/:id', (req, res) => {
    const sql = 'DELETE FROM tracking WHERE tracking_id=?';

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        res.json({ message: 'Tracking Details Deleted Successfully' });
    });
});


// ======================================
// START SERVER
// ======================================

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});