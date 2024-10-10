import express from "express";
import con from "../utils/db.js";

const router = express.Router();

// Create the table if it does not exist
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS customer_po (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer VARCHAR(255),
        po VARCHAR(255),
        co VARCHAR(255),
        date DATE,
        item JSON,
        status VARCHAR(255)
    )
  `;

  try {
    await con.query(query);
    console.log("Table created or already exists.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
};

createTable();

// Insert purchase order
router.post("/insertpo", async (req, res) => {
  const { customer, customerpo, date, status, purchaseOrder, items } = req.body;

  if (!customer || !customerpo || !date || !status || !purchaseOrder || !Array.isArray(items)) {
    return res.status(400).json({ error: true, message: "Missing or invalid data" });
  }

  console.log("Customer:", customer);
  console.log("Customer PO:", customerpo);
  console.log("Date:", date);
  console.log("Status:", status);
  console.log("Purchase Order:", purchaseOrder);
  console.log("Items:", items);

  const insertQuery = `
    INSERT INTO purchase_orders (customer, po, co, date, item, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const insertValues = [
    customer,
    purchaseOrder,
    customerpo,
    date,
    JSON.stringify(items),
    status,
  ];

  const updateQuery = `
    UPDATE item_master 
    SET quantity = quantity - ?
    WHERE name = ?
  `;

  try {
    await con.query("START TRANSACTION");

    for (let item of items) {
      if (!item.name || typeof item.qtyAllocated !== 'number') {
        throw new Error(`Invalid item data: ${JSON.stringify(item)}`);
      }

      const updateValues = [item.qtyAllocated, item.name];
      await con.query(updateQuery, updateValues);
    }

    await con.query(insertQuery, insertValues);
    await con.query("COMMIT");

    res.status(201).json({ message: "Data successfully inserted and inventory updated" });
  } catch (error) {
    await con.query("ROLLBACK");
    console.error("Error inserting data or updating inventory:", error);
    res.status(500).json({ error: true, message: "Error inserting data or updating inventory", details: error.message });
  }
});

// Get purchase orders
router.get("/getpo", async (req, res) => {
  const query = "SELECT * FROM purchase_orders";

  try {
    const [results] = await con.query(query);

    const processedResults = results.map((record) => {
      let itemData;
      try {
        itemData =
          typeof record.item === "string"
            ? JSON.parse(record.item)
            : record.item;
      } catch (parseError) {
        console.error("Error parsing item data:", parseError);
        itemData = null; // Or handle this in a way that fits your application
      }

      return {
        ...record,
        item: itemData,
      };
    });

    res.status(200).json(processedResults);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: true, message: "Error fetching data", details: error.message });
  }
});







export { router as porouter };

