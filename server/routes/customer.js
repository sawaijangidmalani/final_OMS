import express from "express";
import con from "../utils/db.js";

const router=express.Router();

// Route to add a customer
router.post("/add_customer", async (req, res) => {
    const formData = req.body;
    const sql = "INSERT INTO customers (name, email, phone, address, area, city, status, gstn) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
        formData.name,
        formData.email,
        formData.phone,
        formData.address,
        formData.area,
        formData.city,
        formData.status,
        formData.gstn
    ];

    try {
        const [result] = await con.query(sql, values);
        console.log('Inserted ' + result.affectedRows + ' row(s)');
        res.json({ added: true, data: formData });
    } catch (err) {
        console.error('Error inserting data: ' + err.stack);
        res.status(500).send('Error inserting data');
    }
});

// Route to get customer data
router.get("/getCustomerData", async (req, res) => {
    const sql = "SELECT * FROM customers";
    try {
        const [result] = await con.query(sql);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching customer data');
    }
});

// Route to delete a customer
router.post("/deleteCustomer", async (req, res) => {
    const { email } = req.body;
    const sql = "DELETE FROM customers WHERE email = ?";

    try {
        const [result] = await con.query(sql, [email]);
        res.json({ status: result, message: result.affectedRows > 0 ? "Customer deleted successfully" : "Customer not found" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false });
    }
});

// Route to update customer data
router.post("/updateCustomer", async (req, res) => {
    const { email, name, phone, area, address, city, status, gstn } = req.body;
    const sql = `
        UPDATE customers
        SET name = ?, phone = ?, area = ?, address = ?, city = ?, status = ?, GSTN = ?
        WHERE email = ?
    `;

    try {
        const [result] = await con.query(sql, [name, parseInt(phone, 10), area, address, city, status, gstn, email]);
        res.json({ status: true, message: "Customer data updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: "Error updating customer data" });
    }
});

// Route to delete items
router.delete('/deleteItems', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).send({ error: true, message: 'Please provide the name of the item to delete' });
    }

    const query = 'DELETE FROM item_master WHERE name = ?';

    try {
        const [results] = await con.query(query, [name]);
        if (results.affectedRows === 0) {
            return res.status(404).send({ error: true, message: 'Item not found' });
        }

        res.status(200).send({ error: false, message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: true, message: 'Database query failed', details: error });
    }
});


export {router as customerRouter};