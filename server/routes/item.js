// import express, { response } from "express";
// import con from "../utils/db.js";

// const router = express.Router();

// router.post("/insertItems", async (req, res) => {
//   const {
//     name,
//     supplier,
//     category,
//     brand,
//     description,
//     unit,
//     status,
//     quantity,
//     price,
//   } = req.body;

//   if (
//     !name ||
//     !supplier ||
//     !category ||
//     !brand ||
//     !description ||
//     !unit ||
//     !status
//   ) {
//     return res
//       .status(400)
//       .json({ error: true, message: "Please provide all required fields" });
//   }

//   const query =
//     "INSERT INTO item_master (name, supplier, category, brand, description, unit, status, price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
//   const values = [
//     name,
//     supplier,
//     category,
//     brand,
//     description,
//     unit,
//     status,
//     price,
//     quantity,
//   ];

//   try {
//     const [results] = await con.query(query, values);
//     res
//       .status(201)
//       .json({
//         error: false,
//         message: "Item added successfully",
//         itemId: results.insertId,
//       });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: true, message: "Database query failed", details: error });
//   }
// });

// router.get("/getItems", async (req, res) => {
//   const query = "SELECT * FROM item_master";

//   try {
//     const [results] = await con.query(query);
//     res.status(200).json({ error: false, data: results });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: true, message: "Database query failed", details: error });
//   }
// });

// router.put("/updateItems", async (req, res) => {
//   const { name, supplier, category, brand, description, unit, status } =
//     req.body;

//   if (
//     !name ||
//     !supplier ||
//     !category ||
//     !brand ||
//     !description ||
//     !unit ||
//     !status
//   ) {
//     return res
//       .status(400)
//       .json({ error: true, message: "Please provide all required fields" });
//   }

//   const query =
//     "UPDATE item_master SET supplier = ?, category = ?, brand = ?, description = ?, unit = ?, status = ? WHERE name = ?";
//   const values = [supplier, category, brand, description, unit, status, name];

//   try {
//     const [results] = await con.query(query, values);

//     if (results.affectedRows === 0) {
//       return res.status(404).json({ error: true, message: "Item not found" });
//     }

//     res
//       .status(200)
//       .json({ error: false, message: "Item updated successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: true, message: "Database query failed", details: error });
//   }
// });

// router.delete("/deleteItems", async (req, res) => {
//   const { id } = req.body;

//   if (!id) {
//     return res
//       .status(400)
//       .json({
//         error: true,
//         message: "Please provide the name of the item to delete",
//       });
//   }

//   const query = "DELETE FROM item_master WHERE name = ?";
//   const values = [id];

//   try {
//     const [results] = await con.query(query, values);

//     if (results.affectedRows === 0) {
//       return res.status(404).json({ error: true, message: "Item not found" });
//     }

//     res
//       .status(200)
//       .json({ error: false, message: "Item deleted successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: true, message: "Database query failed", details: error });
//   }
// });

// router.get("/getItemStockMaster", (req, res) => {
//   const { name, supplier, category, brand, unit } = req.query;

//   function getRandomNumber(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
//   }

//   const quantity = getRandomNumber(50, 200);
//   res.status(200).json({ message: "Functionality not yet implemented" });
// });

// router.post("/editItemStock", async (req, res) => {
//   const { name, price, qty, date } = req.body;

//   const updateItemQuery = `
//         UPDATE item_master
//         SET quantity = ?, price = ?
//         WHERE name = ?;
//     `;

//   const insertEditItemStockQuery = `
//         INSERT INTO edit_item_stock (name, date, qty, price)
//         VALUES (?, ?, ?, ?);
//     `;

//   try {
//     await con.query(updateItemQuery, [qty, price, name]);
//     await con.query(insertEditItemStockQuery, [name, date, qty, price]);
//     res
//       .status(200)
//       .json({ message: "Item updated and stock logged successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error processing request", error });
//   }
// });

// router.get("/getEditItemDetails", async (req, res) => {
//   const query = "SELECT * FROM edit_item_stock";

//   try {
//     const [results] = await con.query(query);
//     res.status(200).json(results);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: true, message: "Database query failed", details: error });
//   }
// });

// export { router as itemRouter };

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

  if (!name || !supplier || !category || !brand || !description || !unit || !status) {
    return sendErrorResponse(res, 400, "Please provide all required fields");
  }

  const query = `
    INSERT INTO item_master (name, supplier, category, brand, description, unit, status, price, quantity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [name, supplier, category, brand, description, unit, status, price, quantity];

  try {
    const [results] = await con.query(query, values);
    res.status(201).json({ error: false, message: "Item added successfully", itemId: results.insertId });
  } catch (error) {
    sendErrorResponse(res, 500, "Database query failed", error);
  }
});

// Get items
router.get("/getItems", async (req, res) => {
  const query = "SELECT * FROM item_master";

  try {
    const [results] = await con.query(query);
    res.status(200).json({ error: false, data: results });
  } catch (error) {
    sendErrorResponse(res, 500, "Database query failed", error);
  }
});

// Update item
router.put("/updateItems", async (req, res) => {
  const { name, supplier, category, brand, description, unit, status } = req.body;

  if (!name || !supplier || !category || !brand || !description || !unit || !status) {
    return sendErrorResponse(res, 400, "Please provide all required fields");
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

    res.status(200).json({ error: false, message: "Item updated successfully" });
  } catch (error) {
    sendErrorResponse(res, 500, "Database query failed", error);
  }
});

// Delete item
router.delete("/deleteItems", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return sendErrorResponse(res, 400, "Please provide the name of the item to delete");
  }

  const query = "DELETE FROM item_master WHERE name = ?";

  try {
    const [results] = await con.query(query, [name]);

    if (results.affectedRows === 0) {
      return sendErrorResponse(res, 404, "Item not found");
    }

    res.status(200).json({ error: false, message: "Item deleted successfully" });
  } catch (error) {
    sendErrorResponse(res, 500, "Database query failed", error);
  }
});

// Get item stock master
router.get("/getItemStockMaster", (req, res) => {
  const { name, supplier, category, brand, unit } = req.query;

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const quantity = getRandomNumber(50, 200);
  res.status(200).json({ message: "Functionality not yet implemented" });
});

// Edit item stock
router.post("/editItemStock", async (req, res) => {
  const { name, price, qty, date } = req.body;

  const updateItemQuery = `
    UPDATE item_master
    SET quantity = ?, price = ?
    WHERE name = ?
  `;

  const insertEditItemStockQuery = `
    INSERT INTO edit_item_stock (name, date, qty, price)
    VALUES (?, ?, ?, ?)
  `;

  try {
    await con.query(updateItemQuery, [qty, price, name]);
    await con.query(insertEditItemStockQuery, [name, date, qty, price]);
    res.status(200).json({ message: "Item updated and stock logged successfully" });
  } catch (error) {
    sendErrorResponse(res, 500, "Error processing request", error);
  }
});

// Get edit item details
router.get("/getEditItemDetails", async (req, res) => {
  const query = "SELECT * FROM edit_item_stock";

  try {
    const [results] = await con.query(query);
    res.status(200).json(results);
  } catch (error) {
    sendErrorResponse(res, 500, "Database query failed", error);
  }
});

export { router as itemRouter };
