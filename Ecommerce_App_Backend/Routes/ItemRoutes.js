import express from "express";
import { 
  createItem, 
  getItems, 
  getItemById, 
  updateItem, 
  deleteItem 
} from "../Controllers/ItemController.js";
import { authMiddleware } from "../Middlewares/AuthMiddlware.js";

const itemRouter = express.Router();

// Public routes
itemRouter.get("/", getItems);
itemRouter.get("/single", getItemById);

// Protected routes
itemRouter.post("/create", authMiddleware, createItem);
itemRouter.put("/update", authMiddleware, updateItem);
itemRouter.delete("/delete", authMiddleware, deleteItem);

export default itemRouter;
