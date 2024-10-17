import express from "express";
import con from "../utils/db.js";

const router = express.Router();

// Utility function for sending error responses
const sendErrorResponse = (res, statusCode, message, details = null) => {
  res.status(statusCode).json({ error: true, message, details });
};

// Add item
router.post("/insertItems", async (req, res) => {
  const {
    name,
    supplier,
    category,
    brand,
    description,
    unit,
    status,
    quantity,
    price,
  } = req.body;

  if (
    !name ||
    !supplier ||
    !category ||
    !brand ||
    !description ||
    !unit ||
    !status
  ) {
    // return sendErrorResponse(res, 400, "Please provide all required fields");
  }

  const query = `
    INSERT INTO item_master (name, supplier, category, brand, description, unit, status, price, quantity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    name,
    supplier,
    category,
    brand,
    description,
    unit,
    status,
    price,
    quantity,
  ];

  try {
    const [results] = await con.query(query, values);
    res.status(201).json({
      error: false,
      message: "Item added successfully",
      itemId: results.insertId,
    });
  } catch (error) {
    sendErrorResponse(res, 500, "Database query failed", error);
  }
});

router.get("/getItems", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const query = `
    SELECT * FROM item_master
    LIMIT ? OFFSET ?;
  `;
  const countQuery = "SELECT COUNT(*) as totalItems FROM item_master;";

  try {
    const [data] = await con.query(query, [parseInt(limit), parseInt(offset)]);
    const [countResult] = await con.query(countQuery);

    const totalItems = countResult[0].totalItems;
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      error: false,
      data,
      pagination: {
        totalItems,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    sendErrorResponse(res, 500, "Database query failed", error);
  }
});

// Update item
router.put("/updateItems", async (req, res) => {
  const { name, supplier, category, brand, description, unit, status } =
    req.body;

  if (
    !name ||
    !supplier ||
    !category ||
    !brand ||
    !description ||
    !unit ||
    !status
  ) {
    // return sendErrorResponse(res, 400, "Please provide all required fields");
  }

  const query = `
    UPDATE item_master
    SET supplier = ?, category = ?, brand = ?, description = ?, unit = ?, status = ?
    WHERE name = ?
  `;
  const values = [supplier, category, brand, description, unit, status, name];

  try {
    const [results] = await con.query(query, values);

    if (results.affectedRows === 0) {
      return sendErrorResponse(res, 404, "Item not found");
    }
    res
      .status(200)
      .json({ error: false, message: "Item updated successfully" });
  } catch (error) {
    sendErrorResponse(res, 500, "Database query failed", error);
  }
});


// Delete item
router.delete("/deleteItems", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send({
      error: true,
      message: "Please provide the name of the item to delete",
    });
  }

  const query = "DELETE FROM item_master WHERE name = ?";

  try {
    const [results] = await pool.query(query, [name]);
    if (results.affectedRows === 0) {
      return res.status(404).send({ error: true, message: "Item not found" });
    }

    res
      .status(200)
      .send({ error: false, message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: true, message: "Database query failed", details: error });
  }
});


export { router as itemRouter };
