// src/db.ts
import { createConnection } from "typeorm";

export const connectDatabase = async () => {
  return createConnection({
    type: "mysql",
    host: "103.200.23.139",
    port: 3306,
    username: "nglearns_data", // Replace with your MySQL username
    password: "wtqKQEaOVgGH", // Replace with your MySQL password
    database: "nglearns_data", // Replace with your MySQL database name
    entities: [__dirname + "/entities/*.ts"],
    synchronize: true,
  });
};
