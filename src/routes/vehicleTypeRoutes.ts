import { Router } from "express";
import { VehicleTypeController } from "../controllers/VehicleTypeController";
import { authMiddleware } from "../middlewares/authMiddleware";

const vehicleTypeRoutes = Router();

vehicleTypeRoutes
.get('/vehicle-types', new VehicleTypeController().getAllVehicleTypes)
.get('/vehicle-types/:id', new VehicleTypeController().getVehicleTypeById)
.get('/vehicle-types/:id/categories', new VehicleTypeController().getCategories)
.post('/vehicle-types',  authMiddleware, new VehicleTypeController().create)
.post('/vehicle-types/:id/categories', authMiddleware, new VehicleTypeController().createCategory)
.put('/vehicle-types/:id', authMiddleware, new VehicleTypeController().update)
.delete('/vehicle-types/:id', authMiddleware, new VehicleTypeController().delete);

export default vehicleTypeRoutes;
