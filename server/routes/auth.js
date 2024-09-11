import express from "express";
import con from "../utils/db.js";
import nodemailer from "nodemailer"

const router=express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "param.sanjay.shah@gmail.com",
        pass: "wmor tmor amtx kyuc"
    }
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";
    con.query(sql, [email, password], (err, result) => {
        if (err) {
            console.log("Something went wrong", err);
            return res.status(500).json({ error: "Something went wrong" });
        }
        if (result.length > 0) {

            res.json({ result:true,userDetails:result });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    });
});

router.post("/signup", (req, res) => {
    const { email, password } = req.body; 
  
    const checkEmailSql = "SELECT * FROM admin WHERE email = ?";
    con.query(checkEmailSql, [email], (err, result) => {
      if (err) {
        console.error("Error checking email:", err);
        return res.status(500).json({ error: "Something went wrong" });
      }
  
      if (result.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      const insertUserSql = "INSERT INTO admin (email, password) VALUES (?, ?)";
      con.query(insertUserSql, [email, password], (err, result) => {
        if (err) {
          console.error("Error inserting user:", err);
          return res.status(500).json({ error: "Something went wrong" });
        }
  
        res.status(201).json({ success: true, message: "User registered successfully" });
      });
    });
  });
  
  router.post('/forgotPassword', async (req, res) => {
    const { email } = req.body;
  
    const checkEmailSql = "SELECT password FROM admin WHERE email = ?";
    con.query(checkEmailSql, [email], async (err, result) => {
      if (err) {
        console.error("Error querying database:", err);
        return res.status(500).json({ error: "Database error" });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ error: "Email not found" });
      }
  
      const userPassword = result[0].password;
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "param.sanjay.shah@gmail.com",
          pass: "wmor tmor amtx kyuc"
        },
      });
  
      async function sendForgotPasswordEmail() {
        try {
          const info = await transporter.sendMail({
            from: 'param.sanjay.shah@gmail.com',
            to: email,
            subject: "Forgot Password",
            text: `Your password is: ${userPassword}`,
            html: `<b>Your password is: ${userPassword}</b>`,
          });
  
          console.log("Message sent: %s", info.messageId);
          return info;
        } catch (error) {
          console.error("Error sending email:", error);
          throw error;
        }
      }
  
      try {
        const info = await sendForgotPasswordEmail();
        res.status(200).json({ message: "Email sent successfully", messageId: info.messageId });
      } catch (error) {
        res.status(500).json({ error: "Failed to send email" });
      }
    });
  });
  
    export {router as authRoutes};