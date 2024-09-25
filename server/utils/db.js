import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
// console.log(process.env.DB_HOST, process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_DBNAME, process.env.DB_PORT);

async function createDBConnection() {
  try {
    const con = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DBNAME,
      port: process.env.DB_PORT || 3306,
    });

    console.log("DB Connected");
    return con;
  } catch (error) {
    console.error("Error creating database connection:", error);
    throw error;
  }
}

const con = await createDBConnection();
export default con;