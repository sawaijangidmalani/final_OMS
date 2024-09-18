import express from 'express';
import con from '../utils/db.js'; 

const router = express.Router();

const createTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS purchase_orders (
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
        console.log('Table created or already exists.');
    } catch (error) {
        console.error('Error creating table:', error);
    }
};

// Run table creation at startup
createTable();

// Route to insert data into purchase_orders and update item_master
router.post("/insertpo", async (req, res) => {
    const { customer, customerpo, date, status, purchaseOrder, items } = req.body;

    console.log('Customer:', customer);
    console.log('Customer PO:', customerpo);
    console.log('Date:', date);
    console.log('Status:', status);
    console.log('Purchase Order:', purchaseOrder);
    console.log('Items:', items);

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
        status
    ];

    const updateQuery = `
        UPDATE item_master 
        SET quantity = quantity - ?
        WHERE name = ?;
    `;

    try {
        // Begin transaction
        await con.query('START TRANSACTION');

        // Update item quantities
        for (let item of items) {
            const updateValues = [item.qtyAllocated, item.name]; // Ensure item.name is correct
            await con.query(updateQuery, updateValues);
        }

        // Insert into purchase_orders
        await con.query(insertQuery, insertValues);

        // Commit transaction
        await con.query('COMMIT');

        res.status(201).send('Data successfully inserted and inventory updated');
    } catch (error) {
        // Rollback transaction in case of error
        await con.query('ROLLBACK');
        console.error('Error inserting data or updating inventory:', error);
        res.status(500).send('Error inserting data or updating inventory');
    }
});



router.get("/getpo", async (req, res) => {
    const query = `SELECT * FROM purchase_orders`;

    try {
        const [results] = await con.query(query);

        const processedResults = results.map(record => {
            let itemData;
            try {
                itemData = typeof record.item === 'string' ? JSON.parse(record.item) : record.item;
            } catch (parseError) {
                console.error('Error parsing item data:', parseError);
                itemData = record.item; // Fallback to original data if parsing fails
            }
            
            return {
                ...record,
                item: itemData // Assign parsed item data
            };
        });

        res.status(200).json(processedResults);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});


export { router as porouter };
