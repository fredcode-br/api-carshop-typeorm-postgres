import { Status } from "../enums/EStatus";
import { ICategory } from "./ICategory";
import { IManufacturer } from "./IManufacturer";
import { IVehicleImage } from "./IVehicleImage";
import { IVehicleType } from "./IVehicleType";

export interface IVehicle {
    id?: number;
    name: string;
    model: string;
    price: number;
    year: number;
    km: number;
    engine?: string;
    color: string;
    plate?: string;
    gearbox?: string;
    fuel?: string;
    doorsNumber?: number;
    optionals?: string;
    comments?: string;
    status: Status;
    views: number;
    manufacturer: IManufacturer;
    vehicleType: IVehicleType;
    category: ICategory;
    images: IVehicleImage[];
    created_at?: Date;
    manufacturerId?: number;
    categoryId?: number;
    vehicleTypeId?: number;
}
