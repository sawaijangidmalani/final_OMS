import express, { response } from "express";
import con from "../utils/db.js";

const router=express.Router();

router.post('/insertItems', (req, res) => {
    const { name, supplier, category, brand, description, unit, status,quantity,price } = req.body;
    if (!name || !supplier || !category || !brand || !description || !unit || !status) {
        return res.status(400).send({ error: true, message: 'Please provide all required fields' });
    }


    const query = 'INSERT INTO item_master (name, supplier, category, brand, description, unit, status, price,quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)';
    const values = [name, supplier, category, brand, description, unit, status, price,quantity];

    con.query(query, values, (error, results) => {
        if (error) {
            return res.status(500).send({ error: true, message: 'Database query failed', details: error });
        }
        res.status(201).send({ error: false, message: 'Item added successfully', itemId: results.insertId });
    });
});

router.get('/getItems', (req, res) => {
    const query = 'SELECT * FROM item_master';

    con.query(query, (error, results) => {
        if (error) {
            return res.status(500).send({ error: true, message: 'Database query failed', details: error });
        }
        res.status(200).send({ error: false, data: results });
    });
});

router.put('/updateItems', (req, res) => {
    const { name, supplier, category, brand, description, unit, status } = req.body;
    if (!name || !supplier || !category || !brand || !description || !unit || !status) {
        return res.status(400).send({ error: true, message: 'Please provide all required fields' });
    }

    const query = 'UPDATE item_master SET supplier = ?, category = ?, brand = ?, description = ?, unit = ?, status = ? WHERE name = ?';
    const values = [supplier, category, brand, description, unit, status, name];

    con.query(query, values, (error, results) => {
        if (error) {
            return res.status(500).send({ error: true, message: 'Database query failed', details: error });
        }

        if (results.affectedRows === 0) {
            return res.status(404).send({ error: true, message: 'Item not found' });
        }

        res.status(200).send({ error: false, message: 'Item updated successfully' });
    });
});


router.delete('/deleteItems', (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide the name of the item to delete' });
    }

    const query = 'DELETE FROM item_master WHERE name = ?';
    const values = [id];

    con.query(query, values, (error, results) => {
        if (error) {
            return res.status(500).send({ error: true, message: 'Database query failed', details: error });
        }

        if (results.affectedRows === 0) {
            return res.status(404).send({ error: true, message: 'Item not found' });
        }

        res.status(200).send({ error: false, message: 'Item deleted successfully' });
    });
});

router.get("/getItemStockMaster",(req,res)=>{
    const {name,supplier,category,brand,unit}=req.body;
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const quantity = getRandomNumber(50, 200);

    
})

router.post("/editItemStock", (req, res) => {
    const { name, price, qty, date } = req.body;

    const updateItemQuery = `
        UPDATE item_master
        SET quantity = ?, price = ?
        WHERE name = ?;
    `;

    const insertEditItemStockQuery = `
        INSERT INTO edit_item_stock (name, date, qty, price)
        VALUES (?, ?, ?, ?);
    `;

    con.query(updateItemQuery, [ qty, price, name], (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error updating item", error });
        }

        con.query(insertEditItemStockQuery, [name, date, qty, price], (error, results) => {
            if (error) {
                return res.status(500).json({ message: "Error inserting into edit_item_stock", error });
            }

            res.status(200).json({ message: "Item updated and stock logged successfully" });
        });
    });
});

router.get("/getEditItemDetails",(req,res)=>{
    const query="SELECT * FROM edit_item_stock";
    con.query(query,(err,response)=>{
        if(err){
            return console.log(err)
        }
        else{
            return res.json(response)
        }
    })
})

export {router as itemRouter};

