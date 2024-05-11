import { Request, Response } from "express";
import { CategoryServices } from "../services/CategoryServices";

const categoryServices = new CategoryServices();

export class CategoryController {
    async getCategoryById(req: Request, res: Response) {
        const { id } = req.params;
        const result = await categoryServices.getOne({id});
        return res.json(result);
    }

    async getAllCategories(req: Request, res: Response) {
        const result = await categoryServices.getAll();
        return res.json(result);
    }

    async getCategoryByVehicleType(req: Request, res: Response) {
        const { id } = req.params; 

        const result = await categoryServices.getByVehicleType({ vehicleTypeId: id });
        return res.json(result);
    }

    async create(req: Request, res: Response) {
        const { id } = req.params;  
        const { name } = req.body;

        const result = await categoryServices.create({ vehicleTypeId: id, name });
        return res.status(201).json(result);
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;

        const { name, vehicleTypeId } = req.body;
        const result = await categoryServices.updateCategory({ id, name, vehicleTypeId });
        return res.json('Categoria atualizada com sucesso!');
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const result = await categoryServices.deleteCategory({id});
        return res.json('Categoria excluída com sucesso!');
    }
}