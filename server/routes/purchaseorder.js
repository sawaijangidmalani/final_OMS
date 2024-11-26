import express from "express";
import con from "../utils/db.js";

const router = express.Router();

router.post("/insertpo", async (req, res) => {
  const {
    CustomerID,
    CustomerSalesOrderID,
    PurchaseOrderNumber,
    PurchaseDate,
    Status,
  } = req.body;

  if (
    !CustomerID ||
    !CustomerSalesOrderID ||
    !PurchaseOrderNumber ||
    !PurchaseDate ||
    !Status
  ) {
    return res
      .status(400)
      .json({ error: true, message: "Missing or invalid data" });
  }


  const insertQuery = `
    INSERT INTO purchaseorders (CustomerSalesOrderID, CustomerID, ProviderID, PurchaseOrderNumber, PurchaseDate, Status) 
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  try {
    await con.query("START TRANSACTION");

    const insertValues = [
      CustomerSalesOrderID,
      CustomerID,
      1,
      PurchaseOrderNumber,
      PurchaseDate,
      Status,
    ];

    await con.query(insertQuery, insertValues);

    await con.query("COMMIT");
    res.status(201).json({ message: "Purchase order inserted successfully" });
  } catch (error) {
    await con.query("ROLLBACK");
    console.error("Error inserting data:", error.message);
    res.status(500).json({
      error: true,
      message: "Error inserting purchase order",
      details: error.message,
    });
  }
});


// PUT Edit Purchase Order
router.put("/updatepo/:purchaseOrderNumber", async (req, res) => {
  const { purchaseOrderNumber } = req.params; // Extract PurchaseOrderNumber from the URL params
  const {
    CustomerID,
    CustomerSalesOrderID,
    PurchaseDate,
    Status,
  } = req.body;

  if (!CustomerID || !CustomerSalesOrderID || !PurchaseDate || !Status) {
    return res
      .status(400)
      .json({ error: true, message: "Missing or invalid data" });
  }


  const updateQuery = `
    UPDATE purchaseorders
    SET 
      CustomerSalesOrderID = ?, 
      CustomerID = ?, 
      PurchaseDate = ?, 
      Status = ?
    WHERE PurchaseOrderNumber = ?;
  `;

  try {
    await con.query("START TRANSACTION");

    const updateValues = [
      CustomerSalesOrderID,
      CustomerID,
      PurchaseDate,
      Status,
      purchaseOrderNumber,
    ];

    const [result] = await con.query(updateQuery, updateValues);

    // Check if any row was updated
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: true,
        message: "Purchase order not found",
      });
    }

    await con.query("COMMIT");
    res.status(200).json({ message: "Purchase order updated successfully" });
  } catch (error) {
    await con.query("ROLLBACK");
    console.error("Error updating data:", error.message);
    res.status(500).json({
      error: true,
      message: "Error updating purchase order",
      details: error.message,
    });
  }
});


// GET endpoint to retrieve purchase orders
router.get("/getpo", async (req, res) => {
  const selectQuery = `
    SELECT 
      po.PurchaseOrderID,
      po.CustomerSalesOrderID AS CustomerPO,
      so.SalesOrderNumber,
      po.PurchaseOrderNumber,
      po.PurchaseDate,
      po.Status,
      c.Name AS CustomerName
    FROM 
      purchaseorders po
    JOIN 
      customers c ON po.CustomerID = c.CustomerID
    JOIN
      customersalesorder so ON po.CustomerSalesOrderID = so.CustomerSalesOrderID;
  `;

  try {
    const [rows] = await con.query(selectQuery);
    const formattedRows = rows.map((row) => ({
      CustomerName: row.CustomerName,
      PurchaseOrderNumber: row.PurchaseOrderNumber,
      CustomerPO: row.SalesOrderNumber,
      PurchaseDate: row.PurchaseDate,
      TotalPurchase: 0.0,
      Status: row.Status,
    }));

    res.status(200).json(formattedRows);
  } catch (error) {
    console.error("Error retrieving purchase orders:", error.message);
    res.status(500).json({
      error: true,
      message: "Error retrieving purchase orders",
      details: error.message,
    });
  }
});



router.delete("/deletePurchaseOrder", async (req, res) => {
  const { PurchaseOrderNumber } = req.body;
  console.log("Request Body:", req.body);

  if (!PurchaseOrderNumber) {
    return res.status(400).send("PurchaseOrderNumber is required.");
  }

  const sql = "DELETE FROM purchaseorders WHERE PurchaseOrderNumber = ?";

  try {
    const [result] = await con.query(sql, [PurchaseOrderNumber]);

    if (result.affectedRows > 0) {
      res.status(200).send("Purchase order deleted successfully.");
    } else {
      res.status(404).send("Purchase order not found.");
    }
  } catch (err) {
    console.error("Error deleting purchase order:", err);
    res
      .status(500)
      .send("An error occurred while deleting the purchase order.");
  }
});

// Add Purchase Order Item
router.post("/addpurchaseorderitems", (req, res) => {
  console.log("Incoming request body:", req.body);

  const {
    ItemID,
    PurchaseQty,
    UnitCost,
    PurchasePrice,
    InvoiceNumber,
    InvoiceDate,
    PurchaseOrderID,
  } = req.body;

  if (
    !ItemID ||
    !PurchaseQty ||
    !UnitCost ||
    !PurchasePrice ||
    !PurchaseOrderID
  ) {
    return res
      .status(400)
      .json({ message: "Missing required fields", data: req.body });
  }

  const sql = `
    INSERT INTO purchaseorderitems 
    (ItemID, PurchaseQty, UnitCost, PurchasePrice, InvoiceNumber, InvoiceDate, PurchaseOrderID)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  con.query(
    sql,
    [
      ItemID,
      PurchaseQty,
      UnitCost,
      PurchasePrice,
      InvoiceNumber || null,
      InvoiceDate || null,
      PurchaseOrderID,
    ],
    (err, result) => {
      if (err) {
        console.error("Error adding purchase order item:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      res.status(201).json({
        success: true,
        message: "Purchase order item added successfully",
        data: result,
      });
    }
  );
});

// Edit Purchase Order Item
router.put("/editpurchaseorderitems", (req, res) => {
  console.log("Incoming request body for edit:", req.body);

  const {
    ItemID,
    PurchaseQty,
    UnitCost,
    PurchasePrice,
    InvoiceNumber,
    InvoiceDate,
    PurchaseOrderID,
  } = req.body;

  // Validate required fields
  if (
    !ItemID ||
    !PurchaseQty ||
    !UnitCost ||
    !PurchasePrice ||
    !PurchaseOrderID
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const sql = `
    UPDATE purchaseorderitems
    SET PurchaseQty = ?, UnitCost = ?, PurchasePrice = ?, InvoiceNumber = ?, InvoiceDate = ?, PurchaseOrderID = ?
    WHERE ItemID = ? -- Ensure this matches the specific item
  `;

  con.query(
    sql,
    [
      PurchaseQty,
      UnitCost,
      PurchasePrice,
      InvoiceNumber || null,
      InvoiceDate || null,
      PurchaseOrderID,
      ItemID, // Use correct ItemID for WHERE clause
    ],
    (err, result) => {
      if (err) {
        console.error("Error editing purchase order item:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error", error: err });
      }

      if (result.affectedRows > 0) {
        res.status(200).json({
          success: true,
          message: "Purchase order item updated successfully",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No matching item found to update",
        });
      }
    }
  );
});

router.get("/getpurchaseorderitems", (req, res) => {
  const query = `
    SELECT si.ItemID, si.PurchaseQty, si.UnitCost, si.PurchasePrice,si.InvoiceNumber,si.InvoiceDate, i.Name AS ItemName 
  FROM purchaseorderitems si
   INNER JOIN items i ON si.ItemID = i.ItemID
  `;
  con
    .query(query)
    .then(([rows, fields]) => {
      res.status(200).json({ data: rows });
    })
    .catch((err) => {
      console.error("Error fetching purchase order items:", err);
      res.status(500).json({ message: "Database error." });
    });
});

router.delete("/deleteItem/:itemID", (req, res) => {
  const { itemID } = req.params;

  if (!itemID) {
    return res.status(400).json({ message: "ItemID is required" });
  }

  const deleteQuery = "DELETE FROM purchaseorderitems WHERE ItemID = ?";
  con.query(deleteQuery, [itemID], (err, result) => {
    if (err) {
      console.error("Error deleting item:", err);
      return res.status(500).json({ message: "Error deleting item" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  });
});

export { router as porouter };
