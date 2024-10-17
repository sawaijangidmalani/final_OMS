import express from "express";
import con from "../utils/db.js";

const router = express.Router();

// Get all suppliers
router.get('/suppliers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM suppliers');
    res.json({ status: true, data: rows });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ status: false, message: "Error fetching suppliers" });
  }
});

// Add a new supplier
router.post("/addSupplier", async (req, res) => {
  const { name, email, phone, area, address, city, status, gstn } = req.body;

  const sql = `
    INSERT INTO suppliers (name, email, phone, area, address, city, status, gstn)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await pool.query(sql, [
      name,
      email,
      phone,
      area,
      address,
      city,
      status,
      gstn,
    ]);
    res.status(201).json({ status: true, message: "Supplier data inserted successfully" });
  } catch (err) {
    console.error("Error inserting supplier data:", err);
    res.status(500).json({ status: false, message: "Error inserting supplier data" });
  }
});

// Get all suppliers (duplicate of /suppliers)
router.get("/getSuppliers", async (req, res) => {
  const sql = "SELECT * FROM suppliers";

  try {
    const [results] = await pool.query(sql);
    res.status(200).json({ status: true, data: results });
  } catch (err) {
    console.error("Error fetching supplier data:", err);
    res.status(500).json({ status: false, message: "Error fetching supplier data" });
  }
});

// Edit supplier details
router.put("/editSupplier", async (req, res) => {
  const { name, email, phone, area, address, city, status, gstn } = req.body;

  const sql = `
    UPDATE suppliers 
    SET name = ?, phone = ?, area = ?, address = ?, city = ?, status = ?, gstn = ?
    WHERE email = ?
  `;

  try {
    const [result] = await pool.query(sql, [
      name,
      phone,
      area,
      address,
      city,
      status,
      gstn,
      email,
    ]);

    if (result.affectedRows > 0) {
      res.json({ status: true, message: "Supplier data updated successfully" });
    } else {
      res.status(404).json({ status: false, message: "Supplier not found" });
    }
  } catch (err) {
    console.error("Error updating supplier data:", err);
    res.status(500).json({ status: false, message: "Error updating supplier data" });
  }
});

// Delete a supplier
router.delete("/deleteSupplier", async (req, res) => {
  const { email } = req.body;

  const sql = `
    DELETE FROM suppliers 
    WHERE email = ?
  `;

  try {
    const [result] = await pool.query(sql, [email]);

    if (result.affectedRows > 0) {
      res.json({ status: true, message: "Supplier data deleted successfully" });
    } else {
      res.status(404).json({ status: false, message: "Supplier not found" });
    }
  } catch (err) {
    console.error("Error deleting supplier data:", err);
    res.status(500).json({ status: false, message: "Error deleting supplier data" });
  }
});

export { router as supplierRouter };
