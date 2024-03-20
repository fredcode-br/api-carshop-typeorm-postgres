import { vehicleTypeRepository } from "../repositories/vehicleTypeRepository";
import { BadRequestError } from "../helpers/api-errors";

type VehicleTypeRequest = {
    id?: string;
    name: string;
    created_at?: string;
  };

export class VehicleTypeServices {
    async getAll() {
        const vehicleTypes = await vehicleTypeRepository.find();

        if(vehicleTypes.length == 0) {
            throw new BadRequestError('Nenhum tipo de veículo encontrado!');
        }

        return vehicleTypes;
    }

    async getOne({ id }: Partial<VehicleTypeRequest>) {
        const vehicleType = await vehicleTypeRepository.findOneBy({ id: Number(id) });

        if(!vehicleType) {
            throw new BadRequestError('Tipo de veículo não encontrado!');
        }

        return vehicleType;
    }

    async create({ name }: VehicleTypeRequest) {
        const vehicleTypeExists = await vehicleTypeRepository.findOneBy({ name });

        if (vehicleTypeExists) {
            throw new BadRequestError('Este tipo de veículo já está cadastrado no sistema!');
        }

        const newVehicleType = vehicleTypeRepository.create({
            name
        });

        await vehicleTypeRepository.save(newVehicleType);
        return newVehicleType;
    }

    async updateVehicleType({ id, name }: Partial<VehicleTypeRequest>) {
        const updatedVehicleTypeData = await vehicleTypeRepository.update(Number(id), { name });

        return updatedVehicleTypeData;
    }

    async deleteVehicleType({ id }: Partial<VehicleTypeRequest>) {
        const vehicleType = await vehicleTypeRepository.delete(Number(id));
        return vehicleType;
    }

}