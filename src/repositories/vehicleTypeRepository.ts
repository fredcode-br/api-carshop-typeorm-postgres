import { AppDataSource } from "../data-source";
import VehicleType from "../entities/VehicleType";

export const vehicleTypeRepository = AppDataSource.getRepository(VehicleType);