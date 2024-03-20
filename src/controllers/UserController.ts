import { Request, Response } from "express";
import { UerServices } from "../services/UserServices";

const userServices = new UerServices();

export class UserController {
    async getUserById(req: Request, res: Response) {
        const { id } = req.params;
        const result = await userServices.getOne({id});
        return res.json(result);
    }

    async getAllUsers(req: Request, res: Response) {
        const result = await userServices.getAll();
        return res.json(result);
    }

    async create(req: Request, res: Response) {
        const { name, email, password } = req.body;

        const result = await userServices.create({ name, email, password });
        return res.status(201).json(result);
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;

        const { name, email } = req.body;
        const result = await userServices.updateUser({ id, name, email });
        return res.json('Usuário atualizado com sucesso!');
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const result = await userServices.deleteUser({id});
        return res.json('Usuário excluído com sucesso!');
    }
}