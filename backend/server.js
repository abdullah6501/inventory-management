const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root@123',
  database: 'inventory'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// fetching inventory id and device
app.get('/devices', (req, res) => {
  const sql = 'SELECT Inventory_ID,Devices FROM inventory_info'; 
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});


//adding the device details
app.post('/api/device', (req, res) => {
  const { deviceSelect, deviceName, serialNumber, brand, condition } = req.body;

  if (!deviceSelect || !deviceName || !serialNumber || !brand || !condition) {
    return res.status(400).json('Missing required fields');
  }

  const query = 'SELECT Inventory_ID FROM inventory_info WHERE Devices = ?';
  db.query(query, [deviceSelect], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json('Error fetching Inventory_ID');
    }
    if (results.length === 0) {
      return res.status(404).json('No inventory found for the selected device');
    }

    const inventoryId = results[0].Inventory_ID;

    const insertQuery = 'INSERT INTO monitor_info (Inventory_ID, Devices, Monitor_Name, Serial_No, Brand, `Condition`) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [inventoryId, deviceSelect, deviceName, serialNumber, brand, condition];

    db.query(insertQuery, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json('Error inserting data');
      }
      return res.status(200).json('Data inserted successfully');
    });
  });
});

//fetching  employee name
app.get('/api/employee', (req, res) => {
  const query = `SELECT Emp_Name FROM name`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching employee:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
    // console.log(results);
  });
});

// fetching device and monitor name for mapping

app.get('/api/monitor_info', (req, res) => {
  const query = 'SELECT Devices, Monitor_Name FROM monitor_info';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching monitor info:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});


//fetching desk
app.get('/api/desk', (req, res) => {
  const query = `SELECT desk_name FROM desk`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching employee:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
    // console.log(results);
  });
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
