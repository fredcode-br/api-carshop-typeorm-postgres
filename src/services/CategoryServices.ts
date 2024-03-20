import { categoryRepository } from "../repositories/categoryRepository";
import { BadRequestError, NotFoundError } from "../helpers/api-errors";
import { vehicleTypeRepository } from "../repositories/vehicleTypeRepository";

type CategoryRequest = {
    id?: string;
    name?: string;
    vehicleTypeId: string
};

export class CategoryServices {
    async getAll() {
        const Categories = await categoryRepository.find();

        if (Categories.length == 0) {
            throw new BadRequestError('Nenhuma categoria encontrada!');
        }

        return Categories;
    }

    async getOne({ id }: Partial<CategoryRequest>) {
        const Category = await categoryRepository.findOneBy({ id: Number(id) });

        if (!Category) {
            throw new BadRequestError('Categoria não encontrada!');
        }

        return Category;
    }

    async getByVehicleType({ vehicleTypeId }: CategoryRequest) {
        const categories = await categoryRepository.find({
            where: {
                vehicleType: { id: Number(vehicleTypeId) }
            },
            relations: ['vehicleType']
        });

        if (categories.length === 0) {
            throw new BadRequestError('Nenhuma categoria encontrada!');
        }   
    
        return categories;
    }
    

    async create({ vehicleTypeId, name }: CategoryRequest) {
        const vehicleType = await vehicleTypeRepository.findOneBy({ id: Number(vehicleTypeId) });

        if (!vehicleType) {
            throw new NotFoundError('Tipo de veículo não encontrado!');
        }

        const newCategory = categoryRepository.create({
            name,
            vehicleType: vehicleType
        });

        await categoryRepository.save(newCategory);

        return newCategory;
    }

    async updateCategory({ id, name }: Partial<CategoryRequest>) {
        const updatedCategoryData = await categoryRepository.update(Number(id), { name });

        return updatedCategoryData;
    }

    async deleteCategory({ id }: Partial<CategoryRequest>) {
        const category = await categoryRepository.delete(Number(id));
        return category;
    }

}