import "express-async-errors";
import express from "express";
import { AppDataSource } from "./data-source";
import cors from "cors";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import path from "path";
import { debug } from "console";

AppDataSource.initialize().then(() => {
    const app = express();
    app.use((req, res, next) => {
        debug(`${req.method} ${req.url}`);
        next();
      })
// Enable debugging for Express

    app.use(cors());
    app.use(express.json());

    app.use('/uploads/manufacturers', express.static(path.join(__dirname, 'assets', 'uploads', 'manufacturers')));
    app.use('/uploads/vehicles', express.static(path.join(__dirname, 'assets', 'uploads', 'vehicles')));

    routes(app);

    // app.use(errorMiddleware);

    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);
    });
}); 