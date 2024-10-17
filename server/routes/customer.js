import express from "express";
import pool from "../utils/db.js"; // Adjust path if necessary

const router = express.Router();

router.post("/add_customer", async (req, res) => {
  const formData = req.body;
  const sql =
    "INSERT INTO customers (name, email, phone, address, area, city, status, gstn) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    formData.name,
    formData.email,
    formData.phone,
    formData.address,
    formData.area,
    formData.city,
    formData.status,
    formData.gstn,
  ];

  try {
    const [result] = await pool.query(sql, values);
    console.log("Inserted " + result.affectedRows + " row(s)");
    res.json({ added: true, data: formData });
  } catch (err) {
    console.error("Error inserting data: " + err.stack);
    res.status(500).send("Error inserting data");
  }
});

router.get("/getCustomerData", async (req, res) => {
  const sql = "SELECT * FROM customers";
  try {
    const [result] = await pool.query(sql);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching customer data");
  }
});

router.post("/deleteCustomer", async (req, res) => {
  const { email } = req.body;
  const sql = "DELETE FROM customers WHERE email = ?";

  try {
    const [result] = await pool.query(sql, [email]);
    res.json({
      status: result,
      message:
        result.affectedRows > 0
          ? "Customer deleted successfully"
          : "Customer not found",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false });
  }
});

router.post("/updateCustomer", async (req, res) => {
  const { email, name, phone, area, address, city, status, gstn } = req.body;
  const sql = `
        UPDATE customers
        SET name = ?, phone = ?, area = ?, address = ?, city = ?, status = ?, GSTN = ?
        WHERE email = ?
    `;

  try {
    const [result] = await pool.query(sql, [
      name,
      parseInt(phone, 10),
      area,
      address,
      city,
      status,
      gstn,
      email,
    ]);
    res.json({ status: true, message: "Customer data updated successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: false, message: "Error updating customer data" });
  }
});

export { router as customerRouter };
