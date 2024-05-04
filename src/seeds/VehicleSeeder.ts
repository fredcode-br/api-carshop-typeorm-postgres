import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import Vehicle from "../entities/Vehicle";
import VehicleImage from "../entities/VehicleImage";
import Manufacturer from "../entities/Manufacturer"; // Importar entidade do fabricante
import VehicleType from "../entities/VehicleType"; // Importar entidade do tipo de veículo
import Category from "../entities/Category"; // Importar entidade da categoria
import { Status } from "../enums/EStatus";

export class VehicleSeeder implements Seeder {
    track?: boolean | undefined;
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const vehicleRepository = dataSource.getRepository(Vehicle);
        const vehicleImageRepository = dataSource.getRepository(VehicleImage);
        const manufacturerRepository = dataSource.getRepository(Manufacturer); // Repositório do fabricante
        const vehicleTypeRepository = dataSource.getRepository(VehicleType); // Repositório do tipo de veículo
        const categoryRepository = dataSource.getRepository(Category); // Repositório da categoria

        const vehiclesData = [
            {
                name: "Gol 2024",
                model: "Gol GL 1.6",
                price: 35000,
                year: 2024,
                km: 20000,
                engine: "1.6 Flex",
                color: "Prata",
                plate: "DEF-5678",
                gearbox: "Manual",
                fuel: "Flex",
                doorsNumber: 4,
                optionals: "Ar condicionado, Vidros elétricos",
                comments: "Único dono, bem conservado, revisões em dia",
                status: "Disponível",
                manufacturerId: 7,
                vehicleTypeId: 1,
                categoryId: 1,
                images: [
                    "/uploads/vehicles/seeds/seed_gol/1.png",
                    "/uploads/vehicles/seeds/seed_gol/2.png",
                    "/uploads/vehicles/seeds/seed_gol/3.png",
                    "/uploads/vehicles/seeds/seed_gol/4.png",
                    "/uploads/vehicles/seeds/seed_gol/5.png",
                    "/uploads/vehicles/seeds/seed_gol/6.png"
                ]
            },  
            {
                name: "C4 2018",
                model: "C4 Pallas Exclusive 2.0",
                price: 45000,
                year: 2018,
                km: 30000,
                engine: "2.0 Flex",
                color: "Preto",
                plate: "ABC-1234",
                gearbox: "Automático",
                fuel: "Flex",
                doorsNumber: 4,
                optionals: "Bancos de couro, Ar condicionado digital",
                comments: "Único dono, ótimo estado",
                status: "Disponível",
                manufacturerId: 2,
                vehicleTypeId: 1,
                categoryId: 2,
                images: [
                    "/uploads/vehicles/seeds/seed_c4/1.png",
                    "/uploads/vehicles/seeds/seed_c4/2.png",
                    "/uploads/vehicles/seeds/seed_c4/3.png",
                    "/uploads/vehicles/seeds/seed_c4/4.png",
                    "/uploads/vehicles/seeds/seed_c4/5.png",
                    "/uploads/vehicles/seeds/seed_c4/6.png"
                ]
            },
            {
                name: "Civic 2019",
                model: "Civic EX 2.0",
                price: 50000,
                year: 2019,
                km: 25000,
                engine: "2.0 Flex",
                color: "Branco",
                plate: "XYZ-5678",
                gearbox: "Automático",
                fuel: "Flex",
                doorsNumber: 4,
                optionals: "Bancos de couro, Sistema de som premium",
                comments: "Segundo dono, bem conservado",
                status: "Disponível",
                manufacturerId: 5,
                vehicleTypeId: 1,
                categoryId: 2,
                images: [
                    "/uploads/vehicles/seeds/seed_civic/1.png",
                    "/uploads/vehicles/seeds/seed_civic/2.png",
                    "/uploads/vehicles/seeds/seed_civic/3.png",
                    "/uploads/vehicles/seeds/seed_civic/4.png",
                    "/uploads/vehicles/seeds/seed_civic/5.png",
                    "/uploads/vehicles/seeds/seed_civic/6.png"
                ]
            },
            {
                name: "Fan 2021",
                model: "Fan 125 KS",
                price: 8000,
                year: 2021,
                km: 15000,
                engine: "125cc",
                color: "Azul",
                plate: "FGH-9012",
                gearbox: "Manual",
                fuel: "Gasolina",
                doorsNumber: 0, 
                optionals: "Partida elétrica",
                comments: "Excelente estado, uso urbano",
                status: "Disponível",
                manufacturerId: 5, 
                vehicleTypeId: 2,
                categoryId: 6,
                images: [
                    "/uploads/vehicles/seeds/seed_fan/1.png",
                    "/uploads/vehicles/seeds/seed_fan/2.png",
                    "/uploads/vehicles/seeds/seed_fan/3.png",
                    "/uploads/vehicles/seeds/seed_fan/4.png",
                    "/uploads/vehicles/seeds/seed_fan/5.png",
                    "/uploads/vehicles/seeds/seed_fan/6.png"
                ]
            },
            {
                name: "Titan 2015",
                model: "Titan 150 EX",
                price: 8500,
                year: 2015,
                km: 12000,
                engine: "150cc",
                color: "Prata",
                plate: "LMN-4567",
                gearbox: "Manual",
                fuel: "Gasolina",
                doorsNumber: 0,
                optionals: "Partida Elétrica",
                comments: "Ótimo estado, bem cuidada",
                status: "Disponível",
                manufacturerId: 5,
                vehicleTypeId: 2,
                categoryId: 6,
                images: [
                    "/uploads/vehicles/seeds/seed_titan/1.png",
                    "/uploads/vehicles/seeds/seed_titan/2.png",
                    "/uploads/vehicles/seeds/seed_titan/3.png",
                    "/uploads/vehicles/seeds/seed_titan/4.png",
                    "/uploads/vehicles/seeds/seed_titan/5.png",
                    "/uploads/vehicles/seeds/seed_titan/6.png"
                ]
            },
            {
                "name": "Golf 2017",
                "model": "Golf GTI",
                "price": 45000,
                "year": 2017,
                "km": 2000,
                "engine": "2.0L Turbo",
                "color": "Branco",
                "plate": "GLF-2017",
                "gearbox": "Automático",
                "fuel": "Gasolina",
                "doorsNumber": 4,
                "optionals": "Teto solar panorâmico, Sistema de navegação",
                "comments": "Em excelente estado, como novo",
                "status": "Disponível",
                "manufacturerId": 7,
                "vehicleTypeId": 1,
                "categoryId": 1,
                images: [
                    "/uploads/vehicles/seeds/seed_golf/1.png",
                    "/uploads/vehicles/seeds/seed_golf/2.png",
                    "/uploads/vehicles/seeds/seed_golf/3.png",
                    "/uploads/vehicles/seeds/seed_golf/4.png",
                    "/uploads/vehicles/seeds/seed_golf/5.png",
                    "/uploads/vehicles/seeds/seed_golf/6.png"
                ]
            },
    
        ];

        for (const data of vehiclesData) {
            const manufacturer = await manufacturerRepository.findOne({ where: { id: data.manufacturerId } });
            const vehicleType = await vehicleTypeRepository.findOne({ where: { id: data.vehicleTypeId } });
            const category = await categoryRepository.findOne({ where: { id: data.categoryId } });

            if (manufacturer && vehicleType && category) {
                const { images, status, manufacturerId, vehicleTypeId, categoryId, ...vehicleData } = data;

                const newVehicle = vehicleRepository.create({
                    ...vehicleData,
                    status: data.status as Status,
                    vehicleType,
                    category,
                    manufacturer
                });

                await vehicleRepository.save(newVehicle);
                
                for (const imageUrl of data.images) { 
                    const vehicleImage = await vehicleImageRepository.create({
                        imageUrl,
                        vehicle: newVehicle
                    });

                    await vehicleImageRepository.save(vehicleImage);
                }

            } else {
                console.log("Não foi possível encontrar todos os dados necessários para criar o veículo.");
            }
        }
    }
}