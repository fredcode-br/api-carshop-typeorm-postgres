import { AppDataSource } from "../data-source";
import Manufacturer from "../entities/Manufacturer";

export const manufacturerRepository = AppDataSource.getRepository(Manufacturer);