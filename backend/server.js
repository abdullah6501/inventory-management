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

// Route to fetch dropdown values from MySQL
app.get('/devices', (req, res) => {
  const sql = 'SELECT Inventory_ID,Devices FROM inventory_info'; 
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// API endpoint to add monitor data
app.post('/api/device', (req, res) => {
    const { deviceName, serialNumber, brand, condition } = req.body;
  
    // Fetch Inventory_ID from inventory_info table based on deviceName
    const query = `SELECT Inventory_ID FROM inventory_info WHERE Devices = '${deviceName}'`;
  
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).send('Error fetching Inventory_ID');
      } else {
        const inventoryId = results[0].Inventory_ID;
  
        const insertQuery = `INSERT INTO monitor_info (Inventory_ID, Devices, Monitor_Name, Serial_No, Brand, \`Condition\`) 
                            VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [inventoryId, deviceName, deviceName, serialNumber, brand, condition];
  
        db.query(insertQuery, values, (err, results) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error inserting data');
          } else {
            res.status(200).send('Data inserted successfully');
          }
        });
      }
    });
  });


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
