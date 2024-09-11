import con from "../utils/db.js";
import express from "express";

const router=express.Router();

router.post('/addSupplier', (req, res) => {
    const { name, email, phone, area,address,city,status,gstn } = req.body;
  
    const sql = `
      INSERT INTO suppliers (name, email, phone, area, address, city,status,GSTN)
      VALUES (?, ?, ?, ?, ?,?,?,?)
    `;
  
    con.query(sql, [name, email, phone, area, address,city,status,gstn], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "Error inserting supplier data" });
      } else {
        return res.json({ status: true, message: "Supplier data inserted successfully" });
      }
    });
  });
  
router.get('/getSuppliers', (req, res) => {
    const sql = 'SELECT * FROM suppliers';
  
    con.query(sql, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "Error fetching supplier data" });
      } else {
        return res.json({ status: true, data: results });
      }
    });
  });
  
  router.put('/editSupplier', (req, res) => {
    const {  name, email, phone, area, address, city, status, gstn } = req.body;
  
    const sql = `
      UPDATE suppliers 
      SET name = ?, phone = ?, area = ?, address = ?, city = ?, status = ?, GSTN = ?
      WHERE email = ?
    `;
  
    con.query(sql, [name, phone, area, address, city, status, gstn, email], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "Error updating supplier data" });
      } else {
        console.log(result)
        return res.json({ status: true, message: "Supplier data updated successfully" });
      }
    });
  });
  
  router.delete('/deleteSupplier', (req, res) => {
    const { id } = req.body;
    const sql = `
      DELETE FROM suppliers 
      WHERE email = ?
    `;
  
    con.query(sql, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "Error deleting supplier data" });
      } else {
        if (result.affectedRows > 0) {
          return res.json({ status: true, message: "Supplier data deleted successfully" });
        } else {
          return res.status(404).json({ status: false, message: "Supplier not found" });
        }
      }
    });
  });
  
  export {router as supplierRouter}
  