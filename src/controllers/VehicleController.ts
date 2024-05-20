import { Request, Response } from "express";
import { VehicleServices } from "../services/VehicleServices";
import { IVehicle } from "../types/IVehicle";
import { BadRequestError } from "../helpers/api-errors";
import { uploadVehicleMiddleware } from "../middlewares/uploadVehicleMiddleware";
import { log } from "console";

const vehicleServices = new VehicleServices();

export class VehicleController {
    async getVehicleById(req: Request, res: Response) {
        const { id } = req.params;
        const result = await vehicleServices.getOne({ id: Number(id) });

        return res.json(result);
    }

    async getAllVehicles(req: Request, res: Response) {
        try {
            const { manufacturerId, categoryId, year, minPrice, maxPrice, status, page = 1, limit = 10 } = req.query;
            let { sortBy } = req.query;

            const filters: { manufacturerId?: number; categoryId?: number; year?: number; minPrice?: number; maxPrice?: number, status?: string } = {};

            if (manufacturerId !== undefined && !isNaN(parseInt(manufacturerId as string))) {
                filters.manufacturerId = parseInt(manufacturerId as string);
            }

            if (categoryId !== undefined && !isNaN(parseInt(categoryId as string))) {
                filters.categoryId = parseInt(categoryId as string);
            }

            if (year !== undefined && !isNaN(parseInt(year as string))) {
                filters.year = parseInt(year as string);
            }

            if (minPrice !== undefined && !isNaN(parseFloat(minPrice as string))) {
                filters.minPrice = parseFloat(minPrice as string);
            }

            if (maxPrice !== undefined && !isNaN(parseFloat(maxPrice as string))) {
                filters.maxPrice = parseFloat(maxPrice as string);
            }

            if (status !== undefined) {
                filters.status = status as string;
            }

            if (sortBy && typeof sortBy === 'string') {
                const result = await vehicleServices.getAll(
                    filters,
                    parseInt(page as string),
                    parseInt(limit as string),
                    sortBy as string
                );
                return res.json(result);
            }

            const result = await vehicleServices.getAll(
                filters,
                parseInt(page as string),
                parseInt(limit as string),
            );

            return res.json(result);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async create(req: Request, res: Response) {
        const { name, model, price, year, km, engine, color, plate, gearbox, fuel, doorsNumber, optionals, comments, status, manufacturerId, vehicleTypeId, categoryId, images } = req.body;

        const vehicleData = {
            name,
            model,
            price,
            year,
            km,
            engine,
            color,
            plate,
            gearbox,
            fuel,
            doorsNumber,
            optionals,
            comments,
            status,
            manufacturerId,
            vehicleTypeId,
            categoryId,
            images
        }

        const result = await vehicleServices.create(vehicleData);
        return res.status(201).json(result);
    }

    async postImages(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            throw new BadRequestError('Por favor, forneça o ID do veículo.');
        }

        await uploadVehicleMiddleware(req, res);

        if (req.files === undefined) {
            throw new BadRequestError('Por favor, envie ao menos uma imagem!');
        }

        const imageUrls: string[] = [];

        for (const file of req.files as Express.Multer.File[]) {
            const imageUrl = `/uploads/vehicles/${file.filename}`;
            imageUrls.push(imageUrl);
        }

        const result = await vehicleServices.postImages({ id, imageUrls })
        return res.status(200).json(result);
    }

    async incrementView(req: Request, res: Response) {
        const { id } = req.params;

        const result = await vehicleServices.incrementViewCount(Number(id));
        return res.json(result);
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { name, model, price, year, km, engine, color, plate, gearbox, fuel, doorsNumber, optionals, comments, status, manufacturerId, vehicleTypeId, categoryId, images } = req.body;

        const vehicleData = {
            name,
            model,
            price,
            year,
            km,
            engine,
            color,
            plate,
            gearbox,
            fuel,
            doorsNumber,
            optionals,
            comments,
            status,
            manufacturerId,
            vehicleTypeId,
            categoryId,
            images
        }

        const result = await vehicleServices.updateVehicle(Number(id), vehicleData);
        return res.status(200).json(result);
    }
    
    async updateImages(req: Request, res: Response) {
        const { id } = req.params;
       
        if (!id) {
            throw new BadRequestError('Por favor, forneça o ID do veículo.');
        }

        await uploadVehicleMiddleware(req, res);

        if (req.files != undefined && (Array.isArray(req.files) && req.files.length > 0)) {
            console.log("Here")
            const imageUrls: string[] = [];

            for (const file of req.files as Express.Multer.File[]) {
                const imageUrl = `/uploads/vehicles/${file.filename}`;
                imageUrls.push(imageUrl);
            }
            await vehicleServices.postImages({ id, imageUrls })
        }
        
        const { removedImageUrls } = req.body;
        await vehicleServices.deleteImagesByUrl(removedImageUrls)

        return { message: 'Imagens atualizadas com sucesso!' };
    }
    
    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const result = await vehicleServices.deleteVehicle({ id: Number(id) });
        return res.json('Veículo excluído com sucesso!');
    }

}