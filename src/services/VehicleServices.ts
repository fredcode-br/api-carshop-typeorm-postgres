import { IVehicle } from "../types/IVehicle";
import { vehicleRepository } from "../repositories/vehicleRepository";
import { BadRequestError, NotFoundError } from "../helpers/api-errors";
import Vehicle from "../entities/Vehicle";
import { DeepPartial } from "typeorm";
import { Status } from "../enums/EStatus";
import { vehicleImageRepository } from "../repositories/vehicleImageRepository";
import path from 'path';
import fs from 'fs';
import { manufacturerRepository } from "../repositories/manufacturerRepository";
import { vehicleTypeRepository } from "../repositories/vehicleTypeRepository";
import { categoryRepository } from "../repositories/categoryRepository";
import { IManufacturer } from "../types/IManufacturer";
import { IVehicleType } from "../types/IVehicleType";
import { ICategory } from "../types/ICategory";

interface VehicleRequest {
    id?: number;
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
    status: Status;
    manufacturerId: number;
    vehicleTypeId: number;
    categoryId: number;
}

interface ImagesRequest {
    id: string;
    imageUrls?: string[];
}

export class VehicleServices {


async getAll(filters: { manufacturerId?: number; categoryId?: number; year?: number; minPrice?: number; maxPrice?: number; status?: string; searchTerm?: string }, page: number, limit: number, sortBy?: string) {
    
    
    const query = vehicleRepository.createQueryBuilder('vehicles')
        .leftJoinAndSelect('vehicles.images', 'images')
        .leftJoinAndSelect('vehicles.manufacturer', 'manufacturer')
        .leftJoinAndSelect('vehicles.category', 'category')
        .leftJoinAndSelect('vehicles.vehicleType', 'vehicleType');

    if (filters.manufacturerId !== undefined && !isNaN(filters.manufacturerId)) {
        query.andWhere('vehicles.manufacturer_id = :manufacturerId', { manufacturerId: filters.manufacturerId });
    }
    if (filters.categoryId !== undefined && !isNaN(filters.categoryId)) {
        query.andWhere('vehicles.category_id = :categoryId', { categoryId: filters.categoryId });
    }
    if (filters.year !== undefined && !isNaN(filters.year)) {
        query.andWhere('vehicles.year = :year', { year: filters.year });
    }
    if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
        query.andWhere('vehicles.price >= :minPrice', { minPrice: filters.minPrice });
    }
    if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
        query.andWhere('vehicles.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }
    if (filters.status) {
        query.andWhere('vehicles.status = :status', { status: filters.status });
    }
    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
       
        query.andWhere('vehicles.name LIKE :searchTerm', { searchTerm: `%${filters.searchTerm}%` });
    }

    if (sortBy && typeof sortBy === 'string') {
        query.orderBy(`vehicles.${sortBy}`, 'DESC');
    }

    const [vehicles, totalCount] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

    return {
        vehicles,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit)
    };
}


    async getOne({ id }: Partial<IVehicle>) {
        const vehicle = await vehicleRepository.findOne({
            where: {
                id: Number(id)
            },
            relations: ['images', 'manufacturer', 'category', 'vehicleType']
        });

        if (!vehicle) {
            throw new BadRequestError('Veículo não encontrado!');
        }

        return vehicle;
    }

    async create(vehicleData: VehicleRequest) {
        const vehicleType = await vehicleTypeRepository.findOneBy({ id: Number(vehicleData.vehicleTypeId) });
        const manufacturer = await manufacturerRepository.findOneBy({ id: Number(vehicleData.manufacturerId) });
        const category = await categoryRepository.findOneBy({ id: Number(vehicleData.categoryId) });


        if (!vehicleType) {
            throw new NotFoundError('Tipo de veículo não encontrado!');
        }
        if (!manufacturer) {
            throw new NotFoundError('Fabricante não encontrado!');
        }
        if (!category) {
            throw new NotFoundError('Categoria não encontrada!');
        }

        const deepPartialVehicleData: DeepPartial<Vehicle> = {
            ...vehicleData,
            vehicleType: vehicleType,
            manufacturer: manufacturer,
            category: category,
            status: vehicleData.status as DeepPartial<Status>
        };
        console.log(deepPartialVehicleData)
        const newVehicle = vehicleRepository.create(deepPartialVehicleData);

        console.log(newVehicle)
        await vehicleRepository.save(newVehicle);
        return newVehicle;
    }

    async postImages({ id, imageUrls }: ImagesRequest) {
        if (!id) {
            throw new BadRequestError('Por favor, forneça o ID do veículo.');
        }

        if (!imageUrls || imageUrls.length === 0) {
            throw new BadRequestError('Por favor, envie ao menos uma imagem!');
        }

        const vehicle = await vehicleRepository.findOneBy({ id: Number(id) });
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

    async incrementViewCount(id: number) {
        try {
            if (!id || isNaN(id)) {
                throw new BadRequestError('ID de veículo inválido!');
            }

            const existingVehicle = await vehicleRepository.findOneBy({ id });
            if (!existingVehicle) {
                throw new BadRequestError('Veículo não encontrado!');
            }

            existingVehicle.views = (existingVehicle.views || 0) + 1;

            await vehicleRepository.save(existingVehicle);

            return { message: 'Contador de visualizações incrementado com sucesso!' };
        } catch (error) {
            console.error("Erro ao incrementar visualização do veículo:", error);
            throw new Error('Erro ao incrementar visualização do veículo. Por favor, tente novamente mais tarde.');
        }
    }

    async updateVehicle(id: number, vehicleData: Partial<VehicleRequest>) {
        try {
            const existingVehicle = await vehicleRepository.findOneBy({ id });
            if (!existingVehicle) {
                throw new BadRequestError('Veículo não encontrado!');
            }
    

            if (vehicleData.manufacturerId) {
                const manufacturer = await manufacturerRepository.findOneBy({ id: vehicleData.manufacturerId });
                if (!manufacturer) {
                    throw new BadRequestError('Fabricante não encontrado!');
                }
                existingVehicle.manufacturer = manufacturer;
            }
    
            if (vehicleData.vehicleTypeId) {
                const vehicleType = await vehicleTypeRepository.findOneBy({ id: vehicleData.vehicleTypeId });
                if (!vehicleType) {
                    throw new BadRequestError('Tipo de veículo não encontrado!');
                }
                existingVehicle.vehicleType = vehicleType;
            }
    
            if (vehicleData.categoryId) {
                const category = await categoryRepository.findOneBy({ id: vehicleData.categoryId });
                if (!category) {
                    throw new BadRequestError('Categoria não encontrada!');
                }
                existingVehicle.category = category;
            }
    
            Object.assign(existingVehicle, vehicleData);
            
            await vehicleRepository.save(existingVehicle);
    
            return { message: 'Veículo atualizado com sucesso!' };
        } catch (error) {
            console.error("Erro ao atualizar veículo:", error);
            if (error instanceof BadRequestError) {
                throw error;
            }
            throw new Error('Erro ao atualizar veículo. Por favor, tente novamente mais tarde.');
        }
    }
        
    async updateImages(id: number, imageUrls: string[]) {
        try {
            const existingVehicle = await vehicleRepository.findOneBy({ id });
            if (!existingVehicle) {
                throw new BadRequestError('Veículo não encontrado!');
            }
    
            await this.deleteImages(id); 
            
            for (const imageUrl of imageUrls) {
                const vehicleImage = await vehicleImageRepository.create({
                    imageUrl,
                    vehicle: existingVehicle
                });
                await vehicleImageRepository.save(vehicleImage);
            }
    
            return { message: 'Imagens atualizadas com sucesso!' };
        } catch (error) {
            console.error("Erro ao atualizar imagens do veículo:", error);
            throw new Error('Erro ao atualizar imagens do veículo. Por favor, tente novamente mais tarde.');
        }
    }
    
    async deleteImagesByUrl(imageUrls: Array<string>) {
        for (let imageUrl of imageUrls) {
            const image = await vehicleImageRepository.findOneBy({ imageUrl });
            if (!image) {
                throw new BadRequestError('Imagem não encontrada!');
            }
    
            await vehicleImageRepository.delete({ imageUrl });
    
            const absolutePath = path.join(__dirname, '../assets/', imageUrl);
            fs.unlinkSync(absolutePath);
        }
        return { message: 'Imagens removidas com sucesso!' };
    }
    

    async deleteImages(id: number) {
        const images = await vehicleImageRepository
            .createQueryBuilder("vehicle_image")
            .select("vehicle_image.imageUrl", "imageUrl")
            .where("vehicle_image.vehicle_id = :vehicleId", { vehicleId: id })
            .getRawMany();

        if(images.length > 0){

            const imageUrls = images.map(image => image.imageUrl);
            
            for (const imageUrl of imageUrls) {
                const absolutePath = path.join(__dirname, '../assets/', imageUrl);
                fs.unlinkSync(absolutePath);
            }
            
            await vehicleImageRepository
            .createQueryBuilder()
            .delete()
            .where("vehicle_id = :vehicleId", { vehicleId: id })
            .execute();
            return images;
        }
        return "Nenhuma imagem deletada"

    }

    async deleteVehicle({ id }: Partial<IVehicle>) {
        try {
            if (!id || isNaN(id)) {
                throw new BadRequestError('ID veículo inválido!');
            }

            const existingVehicle = await vehicleRepository.findOneBy({ id });
            if (!existingVehicle) {
                throw new BadRequestError('Veículo não encontrado!');
            }
            
            const deletedImageUrls = await this.deleteImages(id);

            const deletedVehicle = await vehicleRepository.delete(id);

            return { deletedVehicle, deletedImageUrls };
        } catch (error) {
            console.error("Erro ao excluir veículo:", error);
            throw new Error('Erro ao excluir veículo. Por favor, tente novamente mais tarde.');
        }
    }
}    
