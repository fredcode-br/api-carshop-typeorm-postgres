import { Router } from "express";
import { VehicleController } from "../controllers/VehicleController";
import { authMiddleware } from "../middlewares/authMiddleware";


const vehicleRoutes = Router();

vehicleRoutes
.get('/vehicles', new VehicleController().getAllVehicles)
.get('/vehicles/:id', new VehicleController().getVehicleById)
.post('/vehicles/:id/increment', new VehicleController().incrementView)
.post('/vehicles', authMiddleware, new VehicleController().create)
.post('/vehicles/:id/images', authMiddleware, new VehicleController().postImages)
.put('/vehicles/:id', authMiddleware, new VehicleController().update)
.put('/vehicles/:id/images', authMiddleware, new VehicleController().updateImages)
.delete('/vehicles/:id', authMiddleware, new VehicleController().delete);

export default vehicleRoutes;
