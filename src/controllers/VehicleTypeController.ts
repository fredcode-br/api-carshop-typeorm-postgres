import { Request, Response } from "express";
import { VehicleTypeServices } from "../services/VehicleTypeServices";
import { CategoryController } from "./CategoryController";

const vehicleTypeServices = new VehicleTypeServices();

export class VehicleTypeController {
    async getVehicleTypeById(req: Request, res: Response) {
        const { id } = req.params;
        const result = await vehicleTypeServices.getOne({id});
        return res.json(result);
    }

    async getAllVehicleTypes(req: Request, res: Response) {
        const result = await vehicleTypeServices.getAll();
        return res.json(result);
    }

    async create(req: Request, res: Response) {
        const { name } = req.body;

        const result = await vehicleTypeServices.create({ name });
        return res.status(201).json(result);
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;

        const { name } = req.body;
        const result = await vehicleTypeServices.updateVehicleType({ id, name });
        return res.json('Tipo de veículo atualizado com sucesso!');
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const result = await vehicleTypeServices.deleteVehicleType({id});
        return res.json('Tipo de veículo excluído com sucesso!');
    }

    async createCategory(req: Request, res: Response){
        const categoryController = new CategoryController();
        await categoryController.create(req, res)
    }

    async getCategories(req: Request, res: Response){
        const categoryController = new CategoryController();
        await categoryController.getCategoryByVehicleType(req, res)
    }
}