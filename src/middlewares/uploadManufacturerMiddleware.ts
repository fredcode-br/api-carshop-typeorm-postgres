import util from "util";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-providers";
import path from "path";
import { Request } from "express";

const bucketName = process.env.AWS_S3_BUCKET_NAME!;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;
const region = process.env.AWS_REGION!;
if (!bucketName || !accessKeyId || !secretAccessKey || !region) {
    throw new Error("AWS Credentials not defined");
}

// Configure AWS SDK
const s3 = new S3Client({
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
});

const maxSize = 2 * 1024 * 1024; // 2 MB

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

const manufacturerStorage = multerS3({
    s3: s3,
    bucket: bucketName,
    acl: "public-read", // Or any other ACL policy
    key: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const timestamp = Date.now();
        const newFilename = `manufacturers/${timestamp}${extension}`;
        cb(null, newFilename);
    },
});

const uploadManufacturerFiles = multer({
    storage: manufacturerStorage,
    limits: { fileSize: maxSize },
    fileFilter: fileFilter,
}).array("file", 6); // "file" should match the name attribute of your file input field

const uploadManufacturerMiddleware = util.promisify(uploadManufacturerFiles);

export { uploadManufacturerMiddleware };
