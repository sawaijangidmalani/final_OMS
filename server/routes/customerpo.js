import express from "express";
import con from "../utils/db.js";

const router = express.Router();

router.post("/insertCustomerPo", async (req, res) => {
  const { CustomerID, SalesOrderNumber, SalesDate, Status, SalesTotalPrice } =
    req.body;
  console.log(req.body);

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
  const sql = `
    SELECT cso.*, cust.Name AS CustomerName 
    FROM customersalesorder cso
    JOIN customers cust ON cso.CustomerID = cust.CustomerID
  `;

  try {
    const [results] = await con.query(sql);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching sales orders:", err);
    res.status(500).send("An error occurred while fetching sales orders.");
  }
});

router.put("/updateCustomerPo/:SalesOrderNumber", async (req, res) => {
  const { SalesOrderNumber } = req.params;
  const { CustomerID, ProviderID, SalesDate, Status, SalesTotalPrice, Items } =
    req.body;

  const connection = await con.getConnection();
  try {
    await connection.beginTransaction();

    const updateSalesOrderQuery = `
      UPDATE customersalesorder
      SET CustomerID = ?, ProviderID = ?, SalesDate = ?, Status = ?, SalesTotalPrice = ?
      WHERE SalesOrderNumber = ?
    `;
    const [salesOrderResult] = await connection.execute(updateSalesOrderQuery, [
      CustomerID,
      ProviderID,
      SalesDate,
      Status,
      SalesTotalPrice,
      SalesOrderNumber,
    ]);

    if (salesOrderResult.affectedRows === 0) {
      return res.status(404).json({ message: "Sales Order not found" });
    }
    const insertItemQuery = `
      INSERT INTO customersalesorderitems (SalesOrderNumber, ItemID, Qty, UnitCost)
      VALUES (?, ?, ?, ?)
    `;
    for (const item of Items) {
      await connection.execute(insertItemQuery, [
        SalesOrderNumber,
        item.ItemID,
        item.qty,
        item.unitCost,
      ]);
    }

    await connection.commit();
    res.status(200).json({ message: "Sales Order updated successfully!" });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating sales order:", error);
    res
      .status(500)
      .json({ message: "Failed to update sales order", error: error.message });
  } finally {
    connection.release();
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


// Add Item
router.post("/addcustomersalesorderitems", (req, res) => {
  console.log("Request body:", req.body);

  const { CustomerSalesOrderID, ItemID, SalesQty, UnitCost, SalesPrice, Tax } =
    req.body;

  if (!CustomerSalesOrderID || !ItemID) {
    return res
      .status(400)
      .json({ message: "CustomerSalesOrderID and ItemID are required." });
  }

  if (isNaN(SalesQty) || isNaN(UnitCost) || isNaN(SalesPrice) || isNaN(Tax)) {
    return res.status(400).json({
      message: "SalesQty, UnitCost, SalesPrice, and Tax must be valid numbers.",
    });
  }

  if (SalesQty < 0 || UnitCost < 0 || SalesPrice < 0 || Tax < 0) {
    return res.status(400).json({
      message: "SalesQty, UnitCost, SalesPrice, and Tax cannot be negative.",
    });
  }

  const query = `
    INSERT INTO customersalesorderitems (CustomerSalesOrderID, ItemID, SalesQty, UnitCost, Tax, SalesPrice)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    CustomerSalesOrderID,
    ItemID,
    SalesQty || 0,
    UnitCost || 0,
    Tax || 0,
    SalesPrice || 0,
  ];

  con.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting sales order item:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    res.status(201).json({
      message: "Sales order item added successfully.",
      CustomerSalesOrderItemID: result.insertId,
    });
  });
});

// Edit Item
router.put("/editcustomersalesorderitems", async (req, res) => {
  const { ItemID, SalesQty, UnitCost, SalesPrice, Tax, CustomerSalesOrderID } =
    req.body;

  console.log("Edit request received for ItemID:", ItemID);

  if (!ItemID) {
    return res.status(400).json({ message: "ItemID is required." });
  }

  const updateQuery = `
    UPDATE customersalesorderitems
    SET 
      SalesQty = ?, 
      UnitCost = ?, 
      SalesPrice = ?, 
      Tax = ?, 
      CustomerSalesOrderID = ?
    WHERE ItemID = ?;
  `;

  try {
    const [result] = await con.query(updateQuery, [
      SalesQty,
      UnitCost,
      SalesPrice,
      Tax,
      CustomerSalesOrderID,
      ItemID,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Item not found or already updated." });
    }

    res.status(200).json({ message: "Item updated successfully." });
  } catch (err) {
    console.error("Error updating sales order item:", err);
    res.status(500).json({ message: "Failed to update item." });
  }
});

// Get Item
router.get("/getcustomersalesorderitems", (req, res) => {
  const query = `
    SELECT si.ItemID, si.SalesQty, si.UnitCost, si.SalesPrice, si.Tax, i.Name AS ItemName
    FROM customersalesorderitems si
    INNER JOIN items i ON si.ItemID = i.ItemID
  `;

  con
    .query(query)
    .then(([rows, fields]) => {
      res.status(200).json({ data: rows });
    })
    .catch((err) => {
      console.error("Error fetching sales order items:", err);
      res.status(500).json({ message: "Database error." });
    });
});

// Delete Item
router.delete("/deleteItem/:itemID", (req, res) => {
  const { itemID } = req.params;

  if (!itemID) {
    return res.status(400).json({ message: "ItemID is required" });
  }

  const deleteQuery = "DELETE FROM customersalesorderitems WHERE ItemID = ?";
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

export { router as customerPo };
