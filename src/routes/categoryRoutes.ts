import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import { authMiddleware } from "../middlewares/authMiddleware";

const categoryRoutes = Router();

categoryRoutes
.get('/categories', new CategoryController().getAllCategories)
.get('/categories/:id', new CategoryController().getCategoryById)
.post('/categories', authMiddleware, new CategoryController().create)
.put('/categories/:id', authMiddleware, new CategoryController().update)
.delete('/categories/:id', authMiddleware, new CategoryController().delete);

export default categoryRoutes;
