const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());


// const corsOptions = {
//   origin: 'http://192.168.0.140:91',
//   optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));
const PORT = process.env.PORT || 3003;

// MySQL Connection
const db = mysql.createConnection({
  // connectionLimit: 10,
  host: '192.168.0.140',
  // host: 'localhost',
  user: 'root',
  password: 'root@123',
  database: 'invent'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.json());
// app.use(cors());

app.post('/add/name', (req, res) => {
  const { desk } = req.body;

  if (!desk) {
    return res.status(400).json({ error: 'Employee name is required' });
  }

  const query = 'INSERT INTO name (Emp_Name) VALUES (?)';

  db.query(query, [desk], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Employee name added successfully', id: result.insertId });
  });
});


app.post('/add/desk', (req, res) => {
  const { desk_name } = req.body;

  if (!desk_name) {
    return res.status(400).json({ error: 'Desk name is required' });
  }

  const query = 'INSERT INTO desk (desk_name) VALUES (?)';

  db.query(query, [desk_name], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Desk name already exists' });
      }
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.status(201).json({ message: 'Desk added successfully', id: result.insertId });
  });
});

//fetching inventory details
app.get('/inventorydetails', (req, res) => {
  const query = `SELECT * FROM inventory_info`;
  db.query(query, (err, result) => {
    if (err) {
      console.log("Error fetching inventory details", err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(result);
  });
});

app.get('/data', (req, res) => {
  const empName = req.query.Emp_name;
  const desk = req.query.desk;

  let query = `
    SELECT desk_to_sys.*, resource_to_desk.Emp_name 
    FROM desk_to_sys 
    INNER JOIN resource_to_desk ON desk_to_sys.desk = resource_to_desk.desk
  `;

  let queryParams = [];
  if (empName) {
    query += ' WHERE resource_to_desk.Emp_name LIKE ?';
    queryParams.push(`%${empName}%`);
  } else if (desk) {
    query += ' WHERE desk_to_sys.desk LIKE ?';
    queryParams.push(`%${desk}%`);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});


app.get('/api/allocated_items', (req, res) => {
  const allocatedQuery = `
  SELECT r.Emp_name AS allocatedEmployee, m.Monitor_Name AS allocatedDevice, dts.desk AS allocatedDesk
  FROM resource_to_desk r
  LEFT JOIN desk_to_sys dts ON r.desk = dts.desk
  LEFT JOIN monitor_info m ON dts.monitor = m.Monitor_Name OR dts.mouse = m.Monitor_Name
      OR dts.Bag = m.Monitor_Name OR dts.Wooden_Pedestral = m.Monitor_Name OR dts.CPU = m.Monitor_Name
      OR dts.Head_phone = m.Monitor_Name OR dts.key_board = m.Monitor_Name OR dts.VOIP_IP_Phone = m.Monitor_Name
      OR dts.Water_Bottle = m.Monitor_Name OR dts.web_camera = m.Monitor_Name;  
  `;

  db.query(allocatedQuery, (err, results) => {
    if (err) {
      console.error('Error fetching allocated items:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});


app.post('/api/save', (req, res) => {
  const { employee, desk, devices } = req.body;

  const deviceValues = [
    devices.monitor, devices.mouse, devices.bag, devices.wooden_pedestral,
    devices.cpu, devices.head_phone, devices.key_board, devices.voip_ip_phone,
    devices.water_bottle, devices.web_camera
  ];

  const insertDeskToSysSql = `
    INSERT INTO desk_to_sys (monitor, mouse, Bag, Wooden_Pedestral, CPU, Head_phone, key_board, VOIP_IP_Phone, Water_Bottle, web_camera, desk)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const deskToSysValues = [...deviceValues, desk];

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
      res.json({ employee, desk, ...devices });
    });
  });
});



app.post('/add/list', (req, res) => {
  const { device } = req.body;
  if (!device) {
    return res.status(400).send('Device name is required');
  }

  const query = 'INSERT INTO inventory_info (Devices, Count) VALUES (?, ?)';
  db.query(query, [device, 0], (err, result) => {
    if (err) {
      console.error('Error inserting device into inventory_info:', err);
      return res.status(500).send('Server error');
    }
    res.send({ message: 'Device added to inventory_info successfully' });
  });
});




app.put('/update', (req, res) => {
  const updatedEmployeeDetails = req.body;

  const desk = updatedEmployeeDetails.desk;

  const updateDeskDetailsSql = `UPDATE desk_to_sys SET 
    monitor = ?, 
    mouse = ?, 
    CPU = ?, 
    key_board = ?, 
    VOIP_IP_Phone = ?, 
    Wooden_Pedestral = ?, 
    Water_Bottle = ?, 
    Bag = ?, 
    web_camera = ?, 
    Head_phone = ?
    WHERE desk = ?`;

  const deskDetailsValues = [
    updatedEmployeeDetails.monitor,
    updatedEmployeeDetails.mouse,
    updatedEmployeeDetails.CPU,
    updatedEmployeeDetails.key_board,
    updatedEmployeeDetails.VOIP_IP_Phone,
    updatedEmployeeDetails.Wooden_Pedestral,
    updatedEmployeeDetails.Water_Bottle,
    updatedEmployeeDetails.Bag,
    updatedEmployeeDetails.web_camera,
    updatedEmployeeDetails.Head_phone,
    desk
  ];

  db.query(updateDeskDetailsSql, deskDetailsValues, (err, result) => {
    if (err) {
      console.error('Error updating desk hardware details:', err);
      return res.status(500).json({ error: 'Error updating desk hardware details' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Desk not found' });
    }

    const updatedEmployee = {
      Emp_name: updatedEmployeeDetails.Emp_name,
      desk: desk
    };

    const updateEmployeeSql = `UPDATE resource_to_desk SET Emp_name = ? WHERE desk = ?`;

    db.query(updateEmployeeSql, [updatedEmployee.Emp_name, updatedEmployee.desk], (err, result) => {
      if (err) {
        console.error('Error updating employee assigned to desk:', err);
        return res.status(500).json({ error: 'Error updating employee assigned to desk' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Desk not found' });
      }

      res.json({ message: 'Employee details and desk hardware details updated successfully' });
    });
  });
});


//fetch desk and employee
// app.get('/desk', (req, res) => {
//   const query = 'SELECT * FROM resource_to_desk';
//   db.query(query, (error, results, fields) => {
//     if (error) {
//       console.error('Error querying database: ' + error.stack);
//       res.status(500).send('Error querying database');
//       return;
//     }
//     res.json(results);
//   });
// });


//fetch desk and device data from database
app.get('/data', (req, res) => {
  const query = 'SELECT desk_to_sys.*, resource_to_desk.Emp_name FROM desk_to_sys INNER JOIN resource_to_desk ON desk_to_sys.desk = resource_to_desk.desk';
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error('Error querying database: ' + error.stack);
      res.status(500).send('Error querying database');
      return;
    }
    res.json(results);
  });
});

// fetching inventory id and device
app.get('/devices', (req, res) => {
  const sql = 'SELECT Inventory_ID,Devices FROM inventory_info';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});


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
    const incrementQuery = 'UPDATE inventory_info SET Count = Count + 1 WHERE Inventory_ID = ?';
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

// //adding the device details
// app.post('/api/device', (req, res) => {
//   const { deviceSelect, deviceName, serialNumber, brand, condition } = req.body;

//   if (!deviceSelect || !deviceName || !serialNumber || !brand || !condition) {
//     return res.status(400).json('Missing required fields');
//   }

//   const query = 'SELECT Inventory_ID FROM inventory_info WHERE Devices = ?';
//   db.query(query, [deviceSelect], (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json('Error fetching Inventory_ID');
//     }
//     if (results.length === 0) {
//       return res.status(404).json('No inventory found for the selected device');
//     }

//     const inventoryId = results[0].Inventory_ID;

//     // Increment count in inventory_info table
//     const incrementQuery = 'UPDATE inventory_info SET Count = Count + 1 WHERE Devices = ?';
//     db.query(incrementQuery, [inventoryId], (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json('Error incrementing count in inventory_info table');
//       }

//       const insertQuery = 'INSERT INTO monitor_info (Inventory_ID, Devices, Monitor_Name, Serial_No, Brand, `Condition`) VALUES (?, ?, ?, ?, ?, ?)';
//       const values = [inventoryId, deviceSelect, deviceName, serialNumber, brand, condition];

//       db.query(insertQuery, values, (err, results) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json('Error inserting data');
//         }
//         return res.status(200).json('Data inserted successfully');
//       });
//     });
//   });
// });

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});