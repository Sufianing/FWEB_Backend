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

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const app = express();

// ✅ FIXED CORS CONFIG
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://my-repository-l6wwpb7qm-sufians-projects-62efa871.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Swagger setup
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

// Health check
app.get("/", (req, res) => {
  res.send("<h1>SunnyBooks API is running</h1>");
});

// Port
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
