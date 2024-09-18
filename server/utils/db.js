// // import mysql from "mysql2/promise"; 

// // async function createDBConnection() {
// //   const con = await mysql.createConnection({
// //     host: "localhost",
// //     user: "root",
// //     password: "root",
// //     database: "order_mngt",
// //   });

// //   console.log("DB Connected");
// //   return con;
// // }

// // const con = await createDBConnection();  // or export it
// // export default con;
// import mysql from 'mysql2/promise'; 
// console.log(process.env.DB_HOST);
// console.log(process.env.DB_USERNAME);
// async function createDBConnection() {
//   const con = await mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DBNAME,
//     port: process.env.DB_PORT || 3306, // Default to 3306 if not set
//   });

//   console.log("DB Connected");
//   return con;
// }

// const con = await createDBConnection(); 
// export default con;
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

import mysql from 'mysql2/promise'; 

async function createDBConnection() {
  const con = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    port: process.env.DB_PORT || 3306 // Default to 3306 if not provided
  });

  console.log("DB Connected");
  return con;
}

const con = await createDBConnection(); // This line will cause an error in ES modules
export default con;
