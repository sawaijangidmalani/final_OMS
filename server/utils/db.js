import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
async function createDBConnection() {
    try {

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql8002.site4now.net ',
  user: process.env.DB_USERNAME || 'aad71a_order',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DBNAME || 'db_aad71a_order',
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10 // Adjust this based on your application's needs
});


console.log("DB Connected");
    return pool;
  } catch (error) {
    console.error("Error creating database connection:", error);
    throw error;
  }
}

const pool = await createDBConnection();
export default pool;