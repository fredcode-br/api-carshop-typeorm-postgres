import { Request, Response } from "express";
import { AuthServices } from "../services/AuthServices";


const authServices = new AuthServices();

export class AuthController {
    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const result = await authServices.loginUser({ email, password });

        res.json(result);
    }

    async logout(req: Request, res: Response) {

    }
}