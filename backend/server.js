const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// MySQL Connection
const db = mysql.createConnection({
  connectionLimit: 10,
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


app.post('/api/save', (req, res) => {
  const { employee, monitor, mouse, bag, wooden_pedestral, cpu, head_phone, key_board, voip_ip_phone, water_bottle, web_camera, desk } = req.body;

  const insertDeskToSysSql = 'INSERT INTO desk_to_sys (monitor, mouse, Bag, Wooden_Pedestral, CPU, Head_phone, key_board, VOIP_IP_Phone, Water_Bottle, web_camera, desk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const deskToSysValues = [monitor, mouse, bag, wooden_pedestral, cpu, head_phone, key_board, voip_ip_phone, water_bottle, web_camera, desk];

  db.query(insertDeskToSysSql, deskToSysValues, (err1, result1) => {
    if (err1) {
      console.error('Error adding item:', err1);
      res.status(500).json({ error: 'Error adding item' });
      return;
    }

    console.log('Item added to desk_to_sys successfully');

    const insertResourceToSysSql = 'INSERT INTO resource_to_desk (desk, Emp_name) VALUES (?, ?)';
    const resourceToSysValues = [desk, employee];

    db.query(insertResourceToSysSql, resourceToSysValues, (err2, result2) => {
      if (err2) {
        console.error('Error adding item:', err2);
        res.status(500).json({ error: 'Error adding item' });
        return;
      }

      console.log('Item added to resource_to_sys successfully');

      res.json({ desk, employee, monitor, mouse, bag, wooden_pedestral, cpu, head_phone, key_board, voip_ip_phone, water_bottle, web_camera });
    });
  });
});

// app.post('api/save', (req, res) => {
//   const { employee, monitor, mouse, bag, wooden_pedestral, cpu, head_phone, key_board, voip_ip_phone, water_bottle, web_camera, desk } = req.body;

//   const sql = 'INSERT INTO desk_to_sys ( monitor, mouse, Bag, Wooden_Pedestral, CPU, Head_phone, key_board, VOIP_IP_Phone, Water_Bottle, web_camera, desk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );
//   db.query(sql, [monitor, mouse, bag, wooden_pedestral, cpu, head_phone, key_board, voip_ip_phone, water_bottle, web_camera, desk], (err, result) => {
//     if (err) {
//       console.error('Error adding item:' err);
//       res.status(500).json({ error: 'Error adding item' });
//     }
//     else {
//       console.log('Item added successfully');
//       res.json({ monitor, mouse, bag, wooden_pedestral, cpu, head_phone, key_board, voip_ip_phone, water_bottle, web_camera, desk });
//     });

//   const sql1 = 'INSERT INTO resource_to_sys (desk, Emp_name) VALUES (?, ?)';
//   db.query(sql1, [desk, employee], (err, result) => {
//     if (err) {
//       console.error('Error adding item:' err);
//       res.status(500).json({ error: 'Error adding item' });
//     }
//     else {
//       console.log('Item added successfully');
//       res.json({ desk, employee });
//     });
// });

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

    // Increment count in inventory_info table
    const incrementQuery = 'UPDATE inventory_info SET Count = Count + 1 WHERE Devices = ?';
    db.query(incrementQuery, [inventoryId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json('Error incrementing count in inventory_info table');
      }

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