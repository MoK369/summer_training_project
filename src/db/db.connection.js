// @ts-check
import mysql from "mysql2/promise";

export let connection;

export async function testDBConnection() {
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      database: "training_project_db",
      user: "root",
      password: "",
      multipleStatements:true
    });
    console.log("DB Connected Successfully!");
    const query = "Select 1+1 as result";
    const queryResult = await connection.query(query);
    console.log(`${query}`, queryResult[0]);

    return true;
  } catch {
    console.error("Error Connecting to DB");
    return false;
  }
}
