import { IVehicle } from "../types/IVehicle";
import { vehicleRepository } from "../repositories/vehicleRepository";
import { BadRequestError } from "../helpers/api-errors";
import Vehicle from "../entities/Vehicle";
import { DeepPartial } from "typeorm";
import { Status } from "../enums/EStatus";
import { vehicleImageRepository } from "../repositories/vehicleImageRepository";

interface VehicleRequest {
    name: string;
    model: string;
    price: number;
    year: number;
    km: number;
    engine: string;
    color: string;
    plate?: string;
    gearbox?: string;
    fuel?: string;
    doorsNumber?: number;
    optionals?: string;
    comments?: string;
    status: string;
    manufacturerId: number;
    vehicleTypeId: number;
    categoryId: number;
}

interface ImagesRequest {
    id: string;
    imageUrls?: string[];
}

export class VehicleServices {
    async getAll() {
        const vehicles = await vehicleRepository.find({relations: ['images']});

        if (vehicles.length === 0) {
            throw new BadRequestError('Nenhum veículo encontrado!');
        }

        return vehicles;
    }

    async getOne({ id }: Partial<IVehicle>) {
        const vehicle = await vehicleRepository.findOne({
            where: {
                id: Number(id)  
            },
            relations: ['images']
        });
        
        if (!vehicle) {
            throw new BadRequestError('Veículo não encontrado!');
        }

        return vehicle;
    }

    async create(vehicleData:VehicleRequest) {
       
        const deepPartialVehicleData: DeepPartial<Vehicle> = {
            ...vehicleData,
            status: vehicleData.status as DeepPartial<Status>
        };
        
        const newVehicle = vehicleRepository.create(deepPartialVehicleData);

        await vehicleRepository.save(newVehicle);
        return newVehicle;
    }

    async postImages({id, imageUrls }: ImagesRequest) {
        if (!id) {
            throw new BadRequestError('Por favor, forneça o ID do veículo.');
        }
    
        if (!imageUrls || imageUrls.length === 0) {
            throw new BadRequestError('Por favor, envie ao menos uma imagem!');
        }
        
        const vehicle = await vehicleRepository.findOneBy({id:Number(id)});
        if (!vehicle) {
            throw new BadRequestError('Veículo não encontrado!');
        }

        
        for (const imageUrl of imageUrls) {
            const vehicleImage = await vehicleImageRepository.create({
                imageUrl,
                vehicle
            });
            await vehicleImageRepository.save(vehicleImage);
        }

        return imageUrls;
        
    }
  
    async updateVehicle(vehicleData: Partial<IVehicle>) {
        const { id, ...rest } = vehicleData;
        // const updatedVehicleData = await vehicleRepository.update(Number(id), rest);

        // return updatedVehicleData;
    }

    async deleteVehicle({ id }: Partial<IVehicle>) {
        const vehicle = await vehicleRepository.delete({id});
        return !!vehicle; 
    }
}
