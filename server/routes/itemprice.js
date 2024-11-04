import express from "express";
import con from "../utils/db.js";

const router = express.Router();

router.get("/getItemPrices/:itemId", async (req, res) => {
  const itemId = req.params.itemId;

  try {
    const [results] = await con.query(
      "SELECT * FROM itemsstock WHERE ItemID = ?",
      [itemId]
    );

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No prices found for this item." });
    }

    res.json(results);
  } catch (error) {
    console.error("Error fetching item prices:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Add Item Price
router.post("/addItemPrice", async (req, res) => {
  const { ItemID, PurchasePrice, ProviderID, PurchaseDate, Qty, RemainingQty } =
    req.body;
  console.log(req.body);

  const sql = `
    INSERT INTO itemsstock 
    (ItemID, PurchasePrice, ProviderID, PurchaseDate, Qty, RemainingQty) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await con.query(sql, [
      ItemID,
      PurchasePrice,
      ProviderID,
      PurchaseDate,
      Qty,
      RemainingQty || 0,
    ]);

    res.status(201).json({
      message: "Item price added successfully",
      ItemID: result.insertId,
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      message: "Failed to add item price",
      error: error.message,
    });
  }
});

// **3. Update existing item price (PUT)**
router.put("/updateItemPrice/:id", async (req, res) => {
  const { id } = req.params;
  const { PurchasePrice, Qty, PurchaseDate } = req.body;

  const sql = `
    UPDATE itemsstock 
    SET PurchasePrice = ?, Qty = ?, PurchaseDate = ? 
    WHERE ItemStockID = ?
  `;

  try {
    const [result] = await con.query(sql, [
      PurchasePrice,
      Qty,
      PurchaseDate,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({
      message: "Item price updated successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      message: "Failed to update item price",
      error: error.message,
    });
  }
});

// **4. Delete item price (DELETE)**
router.delete("/deleteItemPrice/:id", async (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM itemsstock WHERE ItemStockID = ?";

  try {
    const [result] = await con.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item price deleted successfully" });
  } catch (error) {
    console.error("Error deleting item price:", error);
    return res.status(500).json({ error: error.message });
  }
});

export { router as itempriceRouter };
