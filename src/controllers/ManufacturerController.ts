import { Request, Response } from "express";
import { ManufacturerServices } from "../services/ManufacturerServices";
import { BadRequestError } from "../helpers/api-errors";
import { uploadManufacturerMiddleware } from "../middlewares/uploadManufacturerMiddleware";
import fs from "fs";

const manufacturerServices = new ManufacturerServices();

export class ManufacturerController {
    async getManufacturerById(req: Request, res: Response) {
        const { id } = req.params;
        const result = await manufacturerServices.getOne({ id });
        return res.json(result);
    }

    async getAllManufacturers(req: Request, res: Response) {
        const result = await manufacturerServices.getAll();
        return res.json(result);
    }

    async create(req: Request, res: Response) {
        await uploadManufacturerMiddleware(req, res);

        if (req.file === undefined) {
            throw new BadRequestError('Por favor, envie uma imagem!');
        }

        const { name } = req.body;

        if (!name) {
            throw new BadRequestError('Por favor, forneça o nome do fabricante.');
        }

        const imageUrl = `/uploads/manufacturers/${req.file.filename}`;

        const result = await manufacturerServices.create({ name, imageUrl });

        return res.status(201).json(result);
    }

    async update(req: Request, res: Response) {
        // await uploadManufacturerMiddleware(req, res);]
        await uploadManufacturerMiddleware(req, res);
        const { id } = req.params;
        const { name } = req.body;
        let imageUrl: string = "";
        
        if (!id) {
            throw new BadRequestError('Por favor, forneça o ID do fabricante.');
        }
        
        if (!name) {
            throw new BadRequestError('Por favor, forneça o nome do fabricante.');
        }
        
        if (req.file) {
            imageUrl = `/uploads/manufacturers/${req.file.filename}`;
            const oldManufacturer = await manufacturerServices.getOne({ id });
            if (oldManufacturer && oldManufacturer.imageUrl) {
                const oldImagePath = oldManufacturer.imageUrl.split('/').pop();
                const imagePath = `./src/assets/uploads/manufacturers/${oldImagePath}`;
        
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error("Erro ao excluir a imagem:", err);
                    }
                });
            }
        }
        
        console.log(imageUrl)
        await manufacturerServices.updateManufacturer({ id, name, imageUrl });

        return res.json('Fabricante atualizado com sucesso!');
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const manufacturer = await manufacturerServices.getOne({ id });
    
        if (!manufacturer) {
            return res.status(404).json({ error: "Fabricante não encontrado." });
        }
    
        const result = await manufacturerServices.deleteManufacturer({ id });
        
        if (manufacturer.imageUrl) {
            const imagePath = `../assets/uploads/manufacturers/${manufacturer.imageUrl.split('/').pop()}`;
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Erro ao excluir a imagem:", err);
                }
            });
        }
        
        return res.json('Fabricante excluído com sucesso!');
    }
}