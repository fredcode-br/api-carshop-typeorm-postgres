import { Request, Response } from "express";
import { VehicleServices } from "../services/VehicleServices";
import { IVehicle } from "../types/IVehicle";
import { BadRequestError } from "../helpers/api-errors";
import { uploadVehicleMiddleware } from "../middlewares/uploadVehicleMiddleware";

const vehicleServices = new VehicleServices();

export class VehicleController {
    async getVehicleById(req: Request, res: Response) {
        const { id } = req.params;
        const result = await vehicleServices.getOne({id:Number(id)});
        
        return res.json(result);
    }

    async getAllVehicles(req: Request, res: Response) {
        const result = await vehicleServices.getAll();
        return res.json(result);
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

    async postImages(req: Request, res: Response){
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
            const imageUrl = `/uploads/vehicles/${id}_${file.filename}`;
            imageUrls.push(imageUrl);
        }

        const result = await vehicleServices.postImages({id, imageUrls})
        return res.status(200).json(result);
    }


    async update(req: Request, res: Response) {
        const { id } = req.params;

        const { name } = req.body;
        const result = await vehicleServices.updateVehicle({ id:Number(id), name });
        return res.json('Tipo de veículo atualizado com sucesso!');
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const result = await vehicleServices.deleteVehicle({id:Number(id)});
        return res.json('Tipo de veículo excluído com sucesso!');
    }
}