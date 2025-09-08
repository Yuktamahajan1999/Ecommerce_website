import express from "express";
import { getCart, addToCart, updateCartItem, removeCartItem } from "../Controllers/CartController.js";
import { authMiddleware } from "../Middlewares/AuthMiddlware.js";


const cartRouter = express.Router();
cartRouter.get("/", authMiddleware, getCart);

// Protected routes
cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.put("/update", authMiddleware, updateCartItem);
cartRouter.delete("/remove", authMiddleware, removeCartItem);

export default cartRouter;
