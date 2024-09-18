import mysql from "mysql2/promise"; 

async function createDBConnection() {
  const con = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "order_mngt",
  });

  console.log("DB Connected");
  return con;
}

const con = await createDBConnection();  // or export it
export default con;
