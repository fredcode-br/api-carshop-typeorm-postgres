import multer from "multer";
import path from "path";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../helpers/api-errors";
import util from "util";

const maxSize = 2 * 1024 * 1024;

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        return cb(new BadRequestError("Apenas imagens nos formatos JPEG, JPG ou PNG são permitidas."));
    }
};

const createDirectory = (basePath: string, directory: string) => {
    const uploadDir = path.join(basePath, '../../src/assets/uploads', directory);
    return uploadDir;
};

const manufacturerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = createDirectory(__dirname, 'manufacturers');
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const timestamp = Date.now();
        const newFilename = `${timestamp}${extension}`;
        cb(null, newFilename);
    },
});

const uploadManufacturerFile = multer({
    storage: manufacturerStorage,
    limits: { fileSize: maxSize },
    fileFilter: fileFilter,
}).single("file");

// Utilizando util.promisify para promisificar a função uploadManufacturerFile
const uploadManufacturerMiddleware = util.promisify((req: Request, res: Response, next: NextFunction) => {
    uploadManufacturerFile(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: "Ocorreu um erro durante o upload do arquivo." });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        } else {
            next();
        }
    });
});

export { uploadManufacturerMiddleware };
