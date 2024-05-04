import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import Category from "../entities/Category";
import VehicleType from "../entities/VehicleType";

export class CategorySeeder implements Seeder {
    track?: boolean | undefined;
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const categoryRepository = dataSource.getRepository(Category);
        const vehicleTypeRepository = dataSource.getRepository(VehicleType);

        const categoriesData = [
            {
                name: "Hatch",
                vehicleTypeName: "Carro"
            },
            {
                name: "Sedan",
                vehicleTypeName: "Carro"
            },
            {
                name: "SUV",
                vehicleTypeName: "Carro"
            },
            {
                name: "Custom",
                vehicleTypeName: "Moto"
            },
            {
                name: "Esportiva",
                vehicleTypeName: "Moto"
            },
            {
                name: "Street",
                vehicleTypeName: "Moto"
            }
        ];

        for (const data of categoriesData) {
            const existingCategory = await categoryRepository.findOne({ where: { name: data.name } });

            if (!existingCategory) {
                const vehicleType = await vehicleTypeRepository.findOne({
                    where: {
                        name: data.vehicleTypeName
                    }
                });

                if (vehicleType) {
                    const newCategory = categoryRepository.create({ ...data, vehicleType });
                    await categoryRepository.save(newCategory);
                }
            }
        }
    }
}
