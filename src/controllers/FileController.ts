// import { Request, Response } from "express";
// import { BadRequestError } from "../helpers/api-errors";
// import { uploadManufacturerMiddleware } from "../middlewares/uploadMiddleware";

// export class FileController {
//     async uploadVehicle(req: Request, res: Response) {        
//         await uploadVehicleMiddleware(req, res);

//         if (req.file == undefined) {
//             throw new BadRequestError('Por favor envie uma imagem!');
//         }

//         const imageUrl = `${req.protocol}://${req.get('host')}/uploads/vehicles/${req.file.filename}`;

//         res.json({
//             message: "Imagem de veículo enviada com sucesso",
//             imageUrl: imageUrl
//         });
//     }
// }
