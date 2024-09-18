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

// Route to handle login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";

  try {
      const [result] = await con.query(sql, [email, password]);

      if (result.length > 0) {
          res.json({ result: true, userDetails: result });
      } else {
          res.status(401).json({ message: "Invalid email or password" });
      }
  } catch (err) {
      console.error("Something went wrong", err);
      res.status(500).json({ error: "Something went wrong" });
  }
});

// Route to handle signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const checkEmailSql = "SELECT * FROM admin WHERE email = ?";
  const insertUserSql = "INSERT INTO admin (email, password) VALUES (?, ?)";

  try {
      const [existingUsers] = await con.query(checkEmailSql, [email]);

      if (existingUsers.length > 0) {
          return res.status(400).json({ message: "Email already exists" });
      }

      await con.query(insertUserSql, [email, password]);
      res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
      console.error("Error processing request:", err);
      res.status(500).json({ error: "Something went wrong" });
  }
});

// Route to handle forgot password
router.post('/forgotPassword', async (req, res) => {
  const { email } = req.body;
  const checkEmailSql = "SELECT password FROM admin WHERE email = ?";

  try {
      const [result] = await con.query(checkEmailSql, [email]);

      if (result.length === 0) {
          return res.status(404).json({ error: "Email not found" });
      }

      const userPassword = result[0].password;

      const sendForgotPasswordEmail = async () => {
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
      };

      const info = await sendForgotPasswordEmail();
      res.status(200).json({ message: "Email sent successfully", messageId: info.messageId });
  } catch (error) {
      res.status(500).json({ error: "Failed to send email" });
  }
});

  
    export {router as authRoutes};