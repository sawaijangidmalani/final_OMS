// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();
// // console.log(process.env.DB_HOST, process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_DBNAME, process.env.DB_PORT);

// async function createDBConnection() {
//   try {
//     const con = await mysql.createConnection({
//       host: process.env.DB_HOST,
//       user: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_DBNAME,
//       port: process.env.DB_PORT || 3306,
//     });

//     console.log("DB Connected");
//     return con;
//   } catch (error) {
//     console.error("Error creating database connection:", error);
//     throw error;
//   }
// }

// const con = await createDBConnection();
// export default con;


// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();

// async function createDBConnection() {
//   try {
//     console.log(`Connecting to DB at ${process.env.DB_HOST}:${process.env.DB_PORT}`);

//     const con = await mysql.createConnection({
//       host: process.env.DB_HOST || 'localhost',
//       user: process.env.DB_USERNAME || 'root',
//       password: process.env.DB_PASSWORD || '',
//       database: process.env.DB_DBNAME || 'order_mngt',
//       port: process.env.DB_PORT || 3306,
//     });

//     console.log("DB Connected");
//     return con;
//   } catch (error) {
//     console.error("Error creating database connection:", error);
//     throw error;
//   }
// }

// const con = await createDBConnection();
// export default con;


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