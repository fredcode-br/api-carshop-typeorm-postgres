import { vehicleTypeRepository } from "../repositories/vehicleTypeRepository";
import { BadRequestError } from "../helpers/api-errors";

type VehicleTypeRequest = {
    id?: string;
    name: string;
    created_at?: string;
};

export class VehicleTypeServices {
    async getAll() {
        const vehicleTypes = await vehicleTypeRepository.find({ order: { id: 'ASC' } });

        if (vehicleTypes.length === 0) {
            throw new BadRequestError('Nenhum tipo de veículo encontrado!');
        }

        return vehicleTypes;
    }

    async getOne({ id }: Partial<VehicleTypeRequest>) {
        if (!id || isNaN(Number(id))) {
            throw new BadRequestError('ID do tipo de veículo inválido!');
        }

        const vehicleType = await vehicleTypeRepository.findOneBy({ id: Number(id) });

        if (!vehicleType) {
            throw new BadRequestError('Tipo de veículo não encontrado!');
        }

        return vehicleType;
    }

    async create({ name }: VehicleTypeRequest) {
        if (!name || name.trim() === '') {
            throw new BadRequestError('O nome do tipo de veículo é obrigatório!');
        }

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
        if (!id || isNaN(Number(id))) {
            throw new BadRequestError('ID do tipo de veículo inválido!');
        }

        if (!name || name.trim() === '') {
            throw new BadRequestError('O nome do tipo de veículo é obrigatório!');
        }

        const updatedVehicleTypeData = await vehicleTypeRepository.update(Number(id), { name });

        return updatedVehicleTypeData;
    }

    async deleteVehicleType({ id }: Partial<VehicleTypeRequest>) {
        if (!id || isNaN(Number(id))) {
            throw new BadRequestError('ID do tipo de veículo inválido!');
        }

        const existingVehicleType = await vehicleTypeRepository.findOneBy({ id: Number(id) });

        if (!existingVehicleType) {
            throw new BadRequestError('Tipo de veículo não encontrado!');
        }

        const deletedVehicleType = await vehicleTypeRepository.delete(Number(id));
        return deletedVehicleType;
    }
}
