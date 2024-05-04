import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import Manufacturer from "../entities/Manufacturer";

export class ManufacturerSeeder implements Seeder {
    track?: boolean | undefined;
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const manufacturerRepository = dataSource.getRepository(Manufacturer);
        const manufacturersData = [
            {
                name: "Chevrolet",
                imageUrl: "/uploads/manufacturers/chevrolet.png",
            },
            {
                name: "Citroën",
                imageUrl: "/uploads/manufacturers/citroen.png",
            },
            {
                name: "Fiat",
                imageUrl: "/uploads/manufacturers/fiat.png",
            },
            {
                name: "Ford",
                imageUrl: "/uploads/manufacturers/ford.png",
            },
            {
                name: "Honda",
                imageUrl: "/uploads/manufacturers/honda.png",
            },
            {
                name: "Peugeot",
                imageUrl: "/uploads/manufacturers/peugeot.png",
            },
            {
                name: "Volkswagen",
                imageUrl: "/uploads/manufacturers/volkswagen.png",
            },
            
        ];

        for (const data of manufacturersData) {
            const existingManufacturer = await manufacturerRepository.findOne({ where: { name: data.name } });

            if (!existingManufacturer) {
                const newManufacturer = manufacturerRepository.create(data);
                await manufacturerRepository.save(newManufacturer);
            }
        }
    }
}
