import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import { authMiddleware } from "../middlewares/authMiddleware";

const categoryRoutes = Router();

// categoryRoutes.use(authMiddleware);

categoryRoutes
.get('/categories', new CategoryController().getAllCategories)
.get('/categories/:id', new CategoryController().getCategoryById)
.post('/categories', new CategoryController().create)
.put('/categories/:id', new CategoryController().update)
.delete('/categories/:id', new CategoryController().delete);

export default categoryRoutes;
