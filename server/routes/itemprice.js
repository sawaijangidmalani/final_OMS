import express from "express";
import con from "../utils/db.js";

const router = express.Router();

// Get all item prices
router.get("/getItemPrices", async (req, res) => {
  try {
    const [results] = await con.query("SELECT * FROM item_price");
    res.json(results);
  } catch (error) {
    console.error("Error fetching item prices:", error);
    return res.status(500).json({ error: error.message });
  }
});

// POST route to add item price
router.post("/addItemPrice", async (req, res) => {
  const { price, qty, date } = req.body;
  const sql = "INSERT INTO item_price (price, qty, date) VALUES (?, ?, ?)";

  try {
    const [result] = await con.query(sql, [price, qty, date]);
    res.status(201).json({
      message: "Item price added successfully",
      id: result.insertId,
      price,
      qty,
      date,
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      message: "Failed to add item price",
      error: error.message,
    });
  }
});

// PUT route to update item price
router.put("/updateItemPrice/:id", async (req, res) => {
  const { id } = req.params;
  const { price, qty, date } = req.body;
  const sql = "UPDATE item_price SET price = ?, qty = ?, date = ? WHERE id = ?";

  try {
    const [result] = await con.query(sql, [price, qty, date, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({
      message: "Item price updated successfully",
      id,
      price,
      qty,
      date,
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      message: "Failed to update item price",
      error: error.message,
    });
  }
});

// Delete item price
router.delete("/deleteItemPrice/:id", async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM item_price WHERE id = ?";

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
