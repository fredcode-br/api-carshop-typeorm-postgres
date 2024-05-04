import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import VehicleType from "../entities/VehicleType";

export class VehicleTypeSeeder implements Seeder {
    track?: boolean | undefined;
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const vehicleTypeRepository = dataSource.getRepository(VehicleType);
        const vehiclesTypesData = [
            {
                name: "Carro",
            },
            {
                name: "Moto",
            }
        ];

        for (const data of vehiclesTypesData) {
            const existingVehicleType = await vehicleTypeRepository.findOne({ where: { name: data.name } });

            if (!existingVehicleType) {
                const newVehicleType = vehicleTypeRepository.create(data);
                await vehicleTypeRepository.save(newVehicleType);
            }
        }
    }
}
