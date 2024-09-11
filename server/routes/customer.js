import express from "express";
import con from "../utils/db.js";

const router=express.Router();

router.post("/add_customer", (req, res) => {
    const formData = req.body;
    
    const sql = "INSERT INTO customers (name, email, phone, address, area, city, status, GSTN) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      formData.name,
      formData.email,
      formData.phone,
      formData.address,
      formData.area,
      formData.city,
      formData.status,
      formData.GSTN
    ];
  
    con.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting data: ' + err.stack);
        res.status(500).send('Error inserting data');
        return;
      }
      console.log('Inserted ' + result.affectedRows + ' row(s)');
      res.json({added:true,data:formData})
    });
  });

  router.get("/getCustomerData",(req,res)=>{
    const sql="SELECT * FROM customers";
    con.query(sql,(err,result)=>{
        if(err){
            console.log(err)
        }else{
            res.json(result)
        }
    })
  })

  router.post("/deleteCustomer",(req,res)=>{
    const {email}=req.body;
    // console.log(email)
    const sql="DELETE FROM customers WHERE email=?";
    con.query(sql,[email],(err,result)=>{
        if(err){
            return res.json({status:false})
        }else{
            return res.json({status:result,message:"Customers deleted successfully"})
        }
    })
})

router.post("/updateCustomer", (req, res) => {
    const formdata = req.body;
    console.log(formdata);  

    const { email, name, phone, area, address, city, status, GSTN } = formdata;

    const phoneInt = parseInt(phone, 10);

    
    const gstnStr = GSTN;

    const sql = `
        UPDATE customers
        SET name = ?, phone = ?, area = ?, address = ?, city = ?, status = ?, GSTN = ?
        WHERE email = ?
    `;

    con.query(sql, [name, phoneInt, area, address, city, status, gstnStr, email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ status: false, message: "Error updating customer data" });
        } else {
             console.log(result);
            return res.json({ status: true, message: "Customer data updated successfully" });
        }
    });
});

router.delete('/deleteItems', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).send({ error: true, message: 'Please provide the name of the item to delete' });
    }

    const query = 'DELETE FROM item_master WHERE name = ?';
    const values = [name];

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

export {router as customerRouter};