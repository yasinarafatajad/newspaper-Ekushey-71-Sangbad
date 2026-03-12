import express, { type Application } from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import newsRoutes from "./routes/newsRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

const port: number = Number(process.env.PORT) || 5000;
const app: Application = express();

// conneect to database
connectDB();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// all end points
app.use("/api/v1", newsRoutes);
app.use("/api/v1", categoryRoutes);

// test route
app.get("/", (req, res) => {
  res.status(200).json({ status: "alive", message: "server working good." });
});

// listen to port
app.listen(port, () => {
  console.log(`server running at ${port}`);
});
