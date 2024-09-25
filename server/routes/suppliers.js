import con from "../utils/db.js";
import express from "express";

const router = express.Router();

router.post("/addSupplier", async (req, res) => {
  const { name, email, phone, area, address, city, status, gstn } = req.body;

  const sql = `
    INSERT INTO suppliers (name, email, phone, area, address, city, status, GSTN)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await con.query(sql, [
      name,
      email,
      phone,
      area,
      address,
      city,
      status,
      gstn,
    ]);
    res.json({ status: true, message: "Supplier data inserted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: false, message: "Error inserting supplier data" });
  }
});

router.get("/getSuppliers", async (req, res) => {
  const sql = "SELECT * FROM suppliers";

  try {
    const [results] = await con.query(sql);
    res.json({ status: true, data: results });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: false, message: "Error fetching supplier data" });
  }
});
router.put("/editSupplier", async (req, res) => {
  const { name, email, phone, area, address, city, status, gstn } = req.body;

  const sql = `
    UPDATE suppliers 
    SET name = ?, phone = ?, area = ?, address = ?, city = ?, status = ?, GSTN = ?
    WHERE email = ?
  `;

  try {
    const [result] = await con.query(sql, [
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
    console.error(err);
    res
      .status(500)
      .json({ status: false, message: "Error updating supplier data" });
  }
});

router.delete("/deleteSupplier", async (req, res) => {
  const { email } = req.body;

  const sql = `
    DELETE FROM suppliers 
    WHERE email = ?
  `;

  try {
    const [result] = await con.query(sql, [email]);
    if (result.affectedRows > 0) {
      res.json({ status: true, message: "Supplier data deleted successfully" });
    } else {
      res.status(404).json({ status: false, message: "Supplier not found" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: false, message: "Error deleting supplier data" });
  }
});

export { router as supplierRouter };
