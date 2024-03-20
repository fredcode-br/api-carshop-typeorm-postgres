import { Router } from "express";
import { ManufacturerController } from "../controllers/ManufacturerController";
import { authMiddleware } from "../middlewares/authMiddleware";

const manufacturerRoutes = Router();

// manufacturerRoutes.use(authMiddleware);

manufacturerRoutes
.get('/manufacturers', new ManufacturerController().getAllManufacturers)
.get('/manufacturers/:id', new ManufacturerController().getManufacturerById)
.post('/manufacturers', new ManufacturerController().create)
.put('/manufacturers/:id', new ManufacturerController().update)
.delete('/manufacturers/:id', new ManufacturerController().delete);

export default manufacturerRoutes;
