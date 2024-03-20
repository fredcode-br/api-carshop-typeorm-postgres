import { AppDataSource } from "../data-source";
import VehicleImage from "../entities/VehicleImage";

export const vehicleImageRepository = AppDataSource.getRepository(VehicleImage);