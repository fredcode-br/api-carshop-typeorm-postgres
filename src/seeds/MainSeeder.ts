import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager, runSeeder } from "typeorm-extension";
import { UserSeeder } from "./UserSeeder";
import { ManufacturerSeeder } from "./ManufacturerSeeder";
import { VehicleTypeSeeder } from "./VehicleTypeSeeder";
import { CategorySeeder } from "./CategorySeeder";
import { VehicleSeeder } from "./VehicleSeeder";


export class MainSeeder implements Seeder {
    track?: boolean | undefined;
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        await runSeeder(dataSource, UserSeeder);
        await runSeeder(dataSource, ManufacturerSeeder);
        await runSeeder(dataSource, VehicleTypeSeeder);
        await runSeeder(dataSource, CategorySeeder);
        await runSeeder(dataSource, VehicleSeeder);
    }

}