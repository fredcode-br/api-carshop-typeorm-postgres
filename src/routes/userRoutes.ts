import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";

const userRoutes = Router();

userRoutes
.get('/users', authMiddleware, new UserController().getAllUsers)
.get('/users/:id', authMiddleware, new UserController().getUserById)
.post('/users', authMiddleware, new UserController().create)
.put('/users/:id', authMiddleware, new UserController().update)
.delete('/users/:id', authMiddleware, new UserController().delete);

export default userRoutes;
