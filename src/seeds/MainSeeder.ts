import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager, runSeeder } from "typeorm-extension";
import { UserSeeder } from "./UserSeeder";
import { ManufacturerSeeder } from "./ManufacturerSeeder";

export class MainSeeder implements Seeder {
    track?: boolean | undefined;
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        await runSeeder(dataSource, UserSeeder);
        await runSeeder(dataSource, ManufacturerSeeder);
    }

}