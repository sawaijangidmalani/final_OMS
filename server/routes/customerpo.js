// import express from "express";
// import con from "../utils/db.js";

// const router = express.Router();

// router.post("/insertCustomerPo", async (req, res) => {
//   const {
//     customer,
//     date,
//     invoice,
//     qtyAllocated,
//     remainingQty,
//     remainingTotalCost,
//   } = req.body;

//   const getRandomNumber = (min, max) =>
//     Math.floor(Math.random() * (max - min + 1)) + min;
//   const cost = getRandomNumber(10000, 50000);

//   const sqlCustomerPo = `
//         INSERT INTO customerpo (name, date, quantity, invoice, cost)
//         VALUES (?, ?, ?, ?, ?)
//     `;

//   const sqlRemainingPo = `
//         INSERT INTO remaining_purchase_order (qty, price, name)
//         VALUES (?, ?, ?)
//     `;

//   try {
//     const [customerPoResult] = await con.query(sqlCustomerPo, [
//       customer,
//       date,
//       qtyAllocated,
//       invoice,
//       cost,
//     ]);

//     const [remainingPoResult] = await con.query(sqlRemainingPo, [
//       remainingQty,
//       remainingTotalCost,
//       customer,
//     ]);

//     res
//       .status(200)
//       .send(
//         "Customer PO and Remaining Purchase Order data inserted successfully."
//       );
//   } catch (err) {
//     console.error("Error inserting data:", err);
//     res.status(500).send("An error occurred while inserting data.");
//   }
// });

// router.get("/getRemainingPurchaseOrder", async (req, res) => {
//   const sql = `
//         SELECT qty, price, name
//         FROM remaining_purchase_order
//     `;

//   try {
//     const [results] = await con.query(sql);

//     res.status(200).json({
//       success: true,
//       data: results,
//     });
//   } catch (err) {
//     console.error("Error retrieving data from remaining_purchase_order:", err);
//     res.status(500).send("An error occurred while retrieving data.");
//   }
// });

// router.get("/getCustomerPo", async (req, res) => {
//   const sql = "SELECT * FROM customerpo";

//   try {
//     const [results] = await con.query(sql);
//     res.status(200).json(results);
//   } catch (err) {
//     console.error("Error fetching data:", err);
//     res.status(500).send("An error occurred while fetching data.");
//   }
// });

// router.delete("/delete", async (req, res) => {
//   const { invoice } = req.body;

//   const sql = "DELETE FROM customerpo WHERE invoice = ?";

//   try {
//     const [result] = await con.query(sql, [invoice]);

//     if (result.affectedRows > 0) {
//       res.status(200).send("Customer PO data deleted successfully.");
//     } else {
//       res.status(404).send("Customer PO not found.");
//     }
//   } catch (err) {
//     console.error("Error deleting data:", err);
//     res.status(500).send("An error occurred while deleting data.");
//   }
// });

// export { router as customerPo };


import express from "express";
import pool from "../utils/db.js";

const router = express.Router();

// Utility function to generate random numbers
const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

router.post("/insertCustomerPo", async (req, res) => {
  const {
    customer,
    date,
    invoice,
    qtyAllocated,
    remainingQty,
    remainingTotalCost,
  } = req.body;

  if (!customer || !date || !invoice || qtyAllocated == null || remainingQty == null || remainingTotalCost == null) {
    return res.status(400).send("All fields are required.");
  }

  const cost = getRandomNumber(10000, 50000);

  const sqlCustomerPo = `
        INSERT INTO customerpo (name, date, quantity, invoice, cost)
        VALUES (?, ?, ?, ?, ?)
    `;

  const sqlRemainingPo = `
        INSERT INTO remaining_purchase_order (qty, price, name)
        VALUES (?, ?, ?)
    `;

  try {
    const [customerPoResult] = await pool.query(sqlCustomerPo, [
      customer,
      date,
      qtyAllocated,
      invoice,
      cost,
    ]);

    const [remainingPoResult] = await pool.query(sqlRemainingPo, [
      remainingQty,
      remainingTotalCost,
      customer,
    ]);

    res
      .status(200)
      .send("Customer PO and Remaining Purchase Order data inserted successfully.");
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).send("An error occurred while inserting data.");
  }
});

router.get("/getRemainingPurchaseOrder", async (req, res) => {
  const sql = `
        SELECT qty, price, name
        FROM remaining_purchase_order
    `;

  try {
    const [results] = await pool.query(sql);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (err) {
    console.error("Error retrieving data from remaining_purchase_order:", err);
    res.status(500).send("An error occurred while retrieving data.");
  }
});

router.get("/getCustomerPo", async (req, res) => {
  const sql = "SELECT * FROM customerpo";

  try {
    const [results] = await pool.query(sql);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send("An error occurred while fetching data.");
  }
});

router.delete("/delete", async (req, res) => {
  const { invoice } = req.body;

  if (!invoice) {
    return res.status(400).send("Invoice number is required.");
  }

  const sql = "DELETE FROM customerpo WHERE invoice = ?";

  try {
    const [result] = await pool.query(sql, [invoice]);

    if (result.affectedRows > 0) {
      res.status(200).send("Customer PO data deleted successfully.");
    } else {
      res.status(404).send("Customer PO not found.");
    }
  } catch (err) {
    console.error("Error deleting data:", err);
    res.status(500).send("An error occurred while deleting data.");
  }
});

export { router as customerPo };
