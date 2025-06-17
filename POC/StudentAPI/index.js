const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());

// MSSQL Configuration
const dbConfig = {
    user: 'sa',
    password: 'nbvcxz',
    server: 'ASHISH_ADHIKARI\\SQLEXPRESS',
    database: 'practice',
    options: {
        encrypt: false, // true if using Azure
        trustServerCertificate: true
    }
};

// GET all students
// app.get('/students', async (req, res) => {
//     try {
//         await sql.connect(dbConfig);
//         const result = await sql.query('SELECT * FROM Student');
//         res.json(result.recordset);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// });
app.get('/students', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;
  
    try {
      await sql.connect(dbConfig);
  
      const result = await sql.query(`
        SELECT ID, Name, Age, Course, College
        FROM Student
        ORDER BY ID
        OFFSET ${offset} ROWS
        FETCH NEXT ${pageSize} ROWS ONLY;
  
        SELECT COUNT(*) AS TotalCount FROM Student;
      `);
  
      const students = result.recordsets[0];
      const totalCount = result.recordsets[1][0].TotalCount;
  
      res.json({ data: students, totalCount });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  

// Server start
app.listen(8080, () => {
    console.log('Server running on port 8080');
});
