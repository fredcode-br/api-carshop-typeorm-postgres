import { Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import Vehicle from "./Vehicle";
import Category from "./Category";

@Entity('vehicles_types')
class VehicleType extends BaseEntity {
    @OneToMany(() => Category, (category) => category.vehicleType)
    categories: Category[];

    @OneToMany(() => Vehicle, (vehicle) => vehicle.vehicleType)
    vehicles: Vehicle[];
}

export default VehicleType;