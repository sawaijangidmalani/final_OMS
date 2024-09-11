import express from "express";
import con from "../utils/db.js";

const router=express.Router();

router.post("/insertCustomerPo", (req, res) => {
    const { customer, date, invoice, qtyAllocated, remainingQty, remainingTotalCost } = req.body;

    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const cost = getRandomNumber(10000, 50000);

    const sqlCustomerPo = `
        INSERT INTO customerpo (name, date, quantity, invoice, cost)
        VALUES (?, ?, ?, ?, ?)
    `;

    con.query(sqlCustomerPo, [customer, date, qtyAllocated, invoice, cost], (err, result) => {
        if (err) {
            console.error("Error inserting data into customerpo:", err);
            return res.status(500).send("An error occurred while inserting data into customerpo.");
        }

        const sqlRemainingPo = `
            INSERT INTO remaining_purchase_order (qty, price, name)
            VALUES (?, ?, ?)
        `;

        con.query(sqlRemainingPo, [remainingQty, remainingTotalCost, customer], (err, result) => {
            if (err) {
                console.error("Error inserting data into remaining_purchase_order:", err);
                return res.status(500).send("An error occurred while inserting data into remaining_purchase_order.");
            }

            res.status(200).send("Customer PO and Remaining Purchase Order data inserted successfully.");
        });
    });
});

router.get("/getRemainingPurchaseOrder", (req, res) => {
    const sql = `
        SELECT qty, price,name
        FROM remaining_purchase_order
    `;

    con.query(sql, (err, results) => {
        if (err) {
            console.error("Error retrieving data from remaining_purchase_order:", err);
            return res.status(500).send("An error occurred while retrieving data.");
        }

        res.status(200).json({
            success: true,
            data: results
        });
    });
});

router.get("/getCustomerPo", (req, res) => {
    const sql = "SELECT * FROM customerpo";

    con.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.status(500).send("An error occurred while fetching data.");
        }
        res.status(200).json(results);
    });
});




router.delete("/delete", (req, res) => {
    const { invoice } = req.body;

    const sql = "DELETE FROM customerpo WHERE invoice = ?";

    con.query(sql, [invoice], (err, result) => {
        if (err) {
            console.error("Error deleting data:", err);
            return res.status(500).send("An error occurred while deleting data.");
        }
        if (result.affectedRows > 0) {
            res.status(200).send("Customer PO data deleted successfully.");
        } else {
            res.status(404).send("Customer PO not found.");
        }
    });
});



export {router as customerPo};