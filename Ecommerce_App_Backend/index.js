import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./Routes/AuthRoutes.js";
import itemRouter from "./Routes/ItemRoutes.js";
import cartRouter from "./Routes/CartRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "https://ecommerce-website-livid-phi.vercel.app"
    ],
    credentials: true,
  })
);
app.use(express.json());

app.use("/auth", authRouter);
app.use("/items", itemRouter);
app.use("/cart", cartRouter);

app.get("/", (req, res) => {
  res.send("E-commerce API running 🚀");
});

const App = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};
App();
