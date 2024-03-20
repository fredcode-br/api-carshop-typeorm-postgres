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
    status: 'Disponível'| 'Desativado' | 'Vendido';
    views: number;
    manufacturer: IManufacturer;
    vehicle_type: IVehicleType;
    category: ICategory;
    images: IVehicleImage[];
    created_at?: Date;
}
