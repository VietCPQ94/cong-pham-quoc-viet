// src/index.ts
import "reflect-metadata"; // Import reflect-metadata first
import express from "express";
import bodyParser from "body-parser";
import { connectDatabase } from "./db";
import resourceRoutes from "./routes/taskRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

const app = express();
app.use(bodyParser.json());
app.use("/tasks", resourceRoutes);

// Serve Swagger UI
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
      console.log("Swagger UI is available at http://localhost:3000/swagger");
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

startServer();
