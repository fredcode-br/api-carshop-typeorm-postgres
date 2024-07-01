import { Request, Response } from "express";
import { ManufacturerServices } from "../services/ManufacturerServices";
import { BadRequestError, NotFoundError } from "../helpers/api-errors";
import util from "util";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-providers";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const manufacturerServices = new ManufacturerServices();

// Configure AWS SDK
const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const maxSize = 2 * 1024 * 1024; // 2 MB

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Apenas imagens são permitidas"));
    }
};

// Multer-S3 storage configuration
const manufacturerStorage = multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME!,
    acl: "public-read", // Or any other ACL policy
    key: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const timestamp = Date.now();
        const newFilename = `manufacturers/${timestamp}-${uuidv4()}${extension}`; // Unique filename generation
        cb(null, newFilename);
    },
});

// Multer upload middleware configuration
const uploadManufacturerFiles = multer({
    storage: manufacturerStorage,
    limits: { fileSize: maxSize },
    fileFilter: fileFilter,
}).single("file"); // Use .single("file") if expecting only one file per request

// Promisify multer upload middleware
const uploadManufacturerMiddleware = util.promisify(uploadManufacturerFiles);

export class ManufacturerController {

    async getAllManufacturers(req: Request, res: Response) {
        try {
            // Call service method to fetch all manufacturers
            const manufacturers = await manufacturerServices.getAll();

            // Return manufacturers array as JSON response
            return res.json(manufacturers);
        } catch (error: any) {
            console.error("Erro ao buscar todos os fabricantes:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }


    async getManufacturerById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Validate if ID is provided
            if (!id) {
                throw new NotFoundError("ID do fabricante não fornecido.");
            }

            // Call service method to fetch manufacturer by ID
            const manufacturer = await manufacturerServices.getOne({ id });

            // Check if manufacturer exists
            if (!manufacturer) {
                throw new NotFoundError("Fabricante não encontrado.");
            }

            // Return manufacturer details as JSON response
            return res.json(manufacturer);
        } catch (error: any) {
            console.error("Erro ao buscar fabricante por ID:", error);
            if (error instanceof NotFoundError) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async create(req: Request, res: Response) {
        try {
            // Process file upload
            await uploadManufacturerMiddleware(req, res);

            // Validate file upload
            if (!req.file) {
                throw new BadRequestError("Por favor, envie uma imagem!");
            }

            // Extract name from request body
            const { name } = req.body;

            // Validate name
            if (!name) {
                throw new BadRequestError("Por favor, forneça o nome do fabricante.");
            }

            // Retrieve S3 URL for uploaded image
            // @ts-ignore
            const imageUrl = req.file.location; // Assuming `req.file.location` contains the S3 URL

            // Create manufacturer using service
            const result = await manufacturerServices.create({ name, imageUrl });

            // Return success response
            return res.status(201).json(result);
        } catch (error: any) {
            console.error("Erro ao criar fabricante:", error);
            if (error instanceof BadRequestError) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
    async update(req: Request, res: Response) {
        try {
            // Process file upload
            await uploadManufacturerMiddleware(req, res);

            // Extract ID from request parameters
            const { id } = req.params;

            // Extract name and imageUrl from request body
            const { name } = req.body;

            // Validate ID
            if (!id) {
                throw new BadRequestError("Por favor, forneça o ID do fabricante.");
            }

            // Validate name
            if (!name) {
                throw new BadRequestError("Por favor, forneça o nome do fabricante.");
            }

            // Fetch existing manufacturer
            const existingManufacturer = await manufacturerServices.getOne({ id });
            if (!existingManufacturer) {
                throw new BadRequestError("Fabricante não encontrado.");
            }

            let newImageUrl = existingManufacturer.imageUrl; // Use existing imageUrl if no new file is uploaded

            // Update imageUrl if a new file is uploaded
            if (req.file) {
                // @ts-ignore
                newImageUrl = req.file.location; // Assuming `req.file.location` contains the S3 URL

                // Delete old image if it exists and is different from the new image URL
                if (existingManufacturer.imageUrl && existingManufacturer.imageUrl !== newImageUrl) {
                    const oldImageKey = existingManufacturer.imageUrl.split('/').pop();
                    const deleteParams = {
                        Bucket: process.env.AWS_S3_BUCKET_NAME!,
                        Key: `manufacturers/${oldImageKey}`,
                    };
                    try {
                        await s3.send(new DeleteObjectCommand(deleteParams));
                    } catch (err) {
                        console.error("Erro ao excluir a imagem antiga:", err);
                    }
                }
            }

            // Update manufacturer using service
            await manufacturerServices.updateManufacturer({ id, name, imageUrl: newImageUrl });

            // Return success response
            return res.json("Fabricante atualizado com sucesso!");
        } catch (error: any) {
            console.error("Erro ao atualizar fabricante:", error);
            if (error instanceof BadRequestError) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            // Extract ID from request parameters
            const { id } = req.params;

            // Retrieve manufacturer details
            const manufacturer = await manufacturerServices.getOne({ id });

            // Check if manufacturer exists
            if (!manufacturer) {
                return res.status(404).json({ error: "Fabricante não encontrado." });
            }

            // Delete manufacturer from database
            const result = await manufacturerServices.deleteManufacturer({ id });

            // Optional: Delete associated image from S3
            if (manufacturer.imageUrl) {
                const key = manufacturer.imageUrl.split('/').pop();
                const params = {
                    Bucket: process.env.AWS_S3_BUCKET_NAME!,
                    Key: key!,
                };

                await s3.send(new DeleteObjectCommand(params)); // Delete object from S3
            }

            // Return success response
            return res.json("Fabricante excluído com sucesso!");
        } catch (error: any) {
            console.error("Erro ao excluir fabricante:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}
