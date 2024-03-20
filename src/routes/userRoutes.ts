import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";

const userRoutes = Router();

// userRoutes.use(authMiddleware);

userRoutes
.get('/users', new UserController().getAllUsers)
.get('/users/:id', new UserController().getUserById)
.post('/users', new UserController().create)
.put('/users/:id', new UserController().update)
.delete('/users/:id', new UserController().delete);

export default userRoutes;
