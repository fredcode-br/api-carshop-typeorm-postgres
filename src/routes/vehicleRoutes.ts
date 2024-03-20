import { Router } from "express";
import { VehicleController } from "../controllers/VehicleController";


const vehicleRoutes = Router();

vehicleRoutes
.get('/vehicles', new VehicleController().getAllVehicles)
.get('/vehicles/:id', new VehicleController().getVehicleById)
.post('/vehicles', new VehicleController().create)
.post('/vehicles/:id/images', new VehicleController().postImages)
.put('/vehicles/:id', new VehicleController().update)
.delete('/vehicles/:id', new VehicleController().delete);

export default vehicleRoutes;
