import { BadRequestError } from "../helpers/api-errors";
import { manufacturerRepository } from "../repositories/manufacturerRepository";

type ManufacturerRequest = {
    id?: string;
    name: string;
    imageUrl: string;
    created_at?: string;
};

export class ManufacturerServices {
    async getAll() {
        const manufacturers = await manufacturerRepository.find({ order: { id: 'ASC' } });

        if (manufacturers.length === 0) {
            throw new BadRequestError('Nenhum fabricante encontrado!');
        }

        return manufacturers;
    }

    async getOne({ id }: Partial<ManufacturerRequest>) {
        if (!id || isNaN(Number(id))) {
            throw new BadRequestError('ID do fabricante inválido!');
        }

        const manufacturer = await manufacturerRepository.findOneBy({ id: Number(id) });

        if (!manufacturer) {
            throw new BadRequestError('Fabricante não encontrado!');
        }

        return manufacturer;
    }

    async create({ name, imageUrl }: ManufacturerRequest) {
        if (!name || !imageUrl) {
            throw new BadRequestError('O nome e a URL da imagem são obrigatórios!');
        }

        const manufacturerExists = await manufacturerRepository.findOneBy({ name });

        if (manufacturerExists) {
            throw new BadRequestError('Este fabricante já está cadastrado no sistema!');
        }

        const newManufacturer = manufacturerRepository.create({
            name,
            imageUrl
        });

        await manufacturerRepository.save(newManufacturer);
        return newManufacturer;
    }

    async updateManufacturer({ id, name, imageUrl }: Partial<ManufacturerRequest>) {
        if (!id || isNaN(Number(id))) {
            throw new BadRequestError('ID do fabricante inválido!');
        }

        if (!name || !imageUrl) {
            throw new BadRequestError('O nome e a URL da imagem são obrigatórios!');
        }

        const updatedManufacturerData = await manufacturerRepository.update(Number(id), { name, imageUrl });

        return updatedManufacturerData;
    }

    async deleteManufacturer({ id }: Partial<ManufacturerRequest>) {
        if (!id || isNaN(Number(id))) {
            throw new BadRequestError('ID do fabricante inválido!');
        }

        const manufacturer = await manufacturerRepository.delete(Number(id));
        return manufacturer;
    }
}
