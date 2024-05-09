import { Router } from "express";
import { ManufacturerController } from "../controllers/ManufacturerController";
import { authMiddleware } from "../middlewares/authMiddleware";

const manufacturerRoutes = Router();

manufacturerRoutes
.get('/manufacturers', new ManufacturerController().getAllManufacturers)
.get('/manufacturers/:id', new ManufacturerController().getManufacturerById)
.post('/manufacturers', authMiddleware, new ManufacturerController().create)
.put('/manufacturers/:id', authMiddleware, new ManufacturerController().update)
.delete('/manufacturers/:id', authMiddleware, new ManufacturerController().delete);

export default manufacturerRoutes;
