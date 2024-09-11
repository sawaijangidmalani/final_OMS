import mysql from "mysql2";

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "order_mngt",
});

con.connect(function (err) {
  if (err) {
    console.log("Connection error:", err);
  } else {
    console.log("DB Connected");

    
  }
});

export default con;
