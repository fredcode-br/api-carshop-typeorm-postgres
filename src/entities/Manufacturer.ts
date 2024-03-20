import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import Vehicle from "./Vehicle";

@Entity('manufacturers')
class Manufacturer extends BaseEntity {
    @Column({ name: 'image_url' })
    imageUrl: string;

    @OneToMany(() => Vehicle, (vehicle) => vehicle.manufacturer)
    vehicles: Vehicle[];
}

export default Manufacturer;