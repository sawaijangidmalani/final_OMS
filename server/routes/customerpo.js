import express from "express";
import con from "../utils/db.js";

const router = express.Router();

// router.post("/insertCustomerPo", async (req, res) => {
//   const {CustomerID, SalesOrderNumber, SalesDate, Status, SalesTotalPrice } =
//     req.body;

//   if (!CustomerID || !SalesOrderNumber || !SalesDate) {
//     return res.status(400).send("All fields are required.");
//   }

//   const salesDateFormat = new Date(SalesDate);
//   if (isNaN(salesDateFormat.getTime())) {
//     return res.status(400).send("SalesDate must be a valid date.");
//   }

//   const sql = `
//     INSERT INTO customersalesorder 
//     (CustomerID, SalesOrderNumber, SalesDate, Status, SalesTotalPrice) 
//     VALUES (?, ?, ?, ?, ?)
//   `;

//   try {
//     const [result] = await con.query(sql, [
//       CustomerID,
//       SalesOrderNumber,
//       salesDateFormat,
//       Status,
//       SalesTotalPrice,
//     ]);

//     if (result.affectedRows === 0) {
//       return res.status(500).send("Failed to insert sales order.");
//     }

//     res.status(200).send("Sales order inserted successfully.");
//   } catch (err) {
//     console.error("Error inserting sales order:", err);
//     res.status(500).send("An error occurred while inserting sales order.");
//   }
// });

router.post("/insertCustomerPo", async (req, res) => {
  const { CustomerID, SalesOrderNumber, SalesDate, Status, SalesTotalPrice } = req.body;

  if (!CustomerID || !SalesOrderNumber || !SalesDate) {
    return res.status(400).send("All fields are required.");
  }

  const salesDateFormat = new Date(SalesDate);
  if (isNaN(salesDateFormat.getTime())) {
    return res.status(400).send("SalesDate must be a valid date.");
  }

  const sql = `
    INSERT INTO customersalesorder 
    (CustomerID, ProviderID, SalesOrderNumber, SalesDate, Status, SalesTotalPrice) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await con.query(sql, [
      CustomerID,
      1,
      SalesOrderNumber,
      salesDateFormat,
      Status,
      SalesTotalPrice,
    ]);

    if (result.affectedRows === 0) {
      return res.status(500).send("Failed to insert sales order.");
    }

    res.status(200).send("Sales order inserted successfully.");
  } catch (err) {
    console.error("Error inserting sales order:", err);
    res.status(500).send("An error occurred while inserting sales order.");
  }
});


router.get("/getCustomerPo", async (req, res) => {
  const sql = "SELECT * FROM customersalesorder";

  try {
    const [results] = await con.query(sql);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching sales orders:", err);
    res.status(500).send("An error occurred while fetching sales orders.");
  }
});

router.delete("/deleteCustomerPo", async (req, res) => {
  const { CustomerSalesOrderID } = req.body;

  if (!CustomerSalesOrderID) {
    return res.status(400).send("CustomerSalesOrderID is required.");
  }

  const sql = "DELETE FROM customersalesorder WHERE CustomerSalesOrderID = ?";

  try {
    const [result] = await con.query(sql, [CustomerSalesOrderID]);

    if (result.affectedRows > 0) {
      res.status(200).send("Sales order deleted successfully.");
    } else {
      res.status(404).send("Sales order not found.");
    }
  } catch (err) {
    console.error("Error deleting sales order:", err);
    res.status(500).send("An error occurred while deleting the sales order.");
  }
});

export { router as customerPo };
