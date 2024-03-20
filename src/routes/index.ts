import { Router, Request, Response } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import manufacturerRoutes from "./manufacturerRoutes";
import vehicleTypeRoutes from "./vehicleTypeRoutes";
import categoryRoutes from "./categoryRoutes";
import vehicleRoutes from "./vehicleRoutes";

export default (app: any): void => {
    const routes = Router();
    routes.get('/',async(req: Request, res: Response) => {
        return res.json('Bem vindo á API CarShop!');
    });

    app.use(
        routes,
        userRoutes,
        authRoutes,
        manufacturerRoutes,
        vehicleTypeRoutes,
        categoryRoutes,
        vehicleRoutes,
    )
}
