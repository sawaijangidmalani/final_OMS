import express from "express";
import con from "../utils/db.js";

const router = express.Router();

// Get all item prices
router.get("/getItemPrices", (req, res) => {
  con.query("SELECT * FROM item_price", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

router.post("/addItemPrice", (req, res) => {
  const { price, qty, date } = req.body;
  console.log("Received data:", req.body); // Check if data is logged correctly
  const sql = "INSERT INTO item_price (price, qty, date) VALUES (?, ?, ?)";

  con.query(sql, [price, qty, date], (err, result) => {
    if (err) {
      console.error("Database error:", err); // Log database error
      return res.status(500).json({
        message: "Failed to add item price",
        error: err.message,
      });
    }

    res.status(201).json({
      message: "Item price added successfully",
      id: result.insertId,
      price,
      qty,
      date,
    });
  });
});

// Update existing item price
router.put("/editItemPrice/:id", (req, res) => {
  const { id } = req.params;
  const { price, qty, date } = req.body;
  const sql = "UPDATE item_price SET price = ?, qty = ?, date = ? WHERE id = ?";

  con.query(sql, [price, qty, date, id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Item price updated successfully" });
  });
});

// Delete item price
router.delete("/deleteItemPrice/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM item_price WHERE id = ?";

  con.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Item price deleted successfully" });
  });
});


export { router as itempriceRouter };
