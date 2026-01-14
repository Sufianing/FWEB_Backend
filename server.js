import express from "express";
import cors from "cors";
import reservation from "./routes/reservation.js";
import user from "./routes/user.js";
import loan from "./routes/loan.js";
import book from "./routes/book.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const app = express();

// ✅ FINAL CORS FIX
app.use(cors());
app.options("*", cors());

// Parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SunnyBooks API",
      version: "1.0.0",
      description: "API documentation for SunnyBooks project",
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/reservation", reservation);
app.use("/user", user);
app.use("/loan", loan);
app.use("/book", book);

app.get("/", (req, res) => {
  res.send("<h1>SunnyBooks API is running</h1>");
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
