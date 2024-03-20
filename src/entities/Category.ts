import { Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import Vehicle from "./Vehicle";
import VehicleType from "./VehicleType";

@Entity('categories')
class Category extends BaseEntity {

    @ManyToOne(() => VehicleType, (vehicleType) => vehicleType.categories)
    @JoinColumn({ name: 'vehicle_type_id' })
    vehicleType: VehicleType;

    @OneToMany(() => Vehicle, (vehicle) => vehicle.category)
    vehicles: Vehicle[];
}

export default Category;