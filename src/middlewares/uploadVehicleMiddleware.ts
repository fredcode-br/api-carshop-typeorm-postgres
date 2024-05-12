import util from "util";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const maxSize = 2 * 1024 * 1024; 

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Apenas imagens são permitidas"));
    }
};

const createDirectory = (basePath: string, directory: string) => {
    const uploadDir = path.join(basePath, directory);
    return uploadDir;
};

const vehicleStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = createDirectory(__dirname, '../../src/assets/uploads/vehicles');
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const timestamp = Date.now();
        const newFilename = `${timestamp}${extension}`;
        cb(null, newFilename);
    },
});

const uploadVehicleFiles = multer({
    storage: vehicleStorage,
    limits: { fileSize: maxSize },
    fileFilter: fileFilter,
}).array("files", 6);

const uploadVehicleMiddleware = util.promisify(uploadVehicleFiles);

export { uploadVehicleMiddleware };
