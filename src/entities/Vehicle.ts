import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import Category from "./Category";
import Manufacturer from "./Manufacturer";
import VehicleImage from "./VehicleImage";
import VehicleType from "./VehicleType";
import { Status } from "../enums/EStatus";

@Entity('vehicles')
class Vehicle extends BaseEntity {
    @Column()
    model: string;

    @Column()
    price: number;

    @Column()
    year: number;

    @Column()
    km: number;

    @Column({ nullable: true })
    engine: string;

    @Column()
    color: string;

    @Column({ nullable: true })
    plate: string;

    @Column({ nullable: true })
    gearbox: string;

    @Column({ nullable: true })
    fuel: string;

    @Column({ name: 'doors_number', nullable: true })
    doorsNumber: number;

    @Column({ nullable: true })
    optionals: string;

    @Column({ nullable: true })
    comments: string;
    
    @Column({ type: 'enum', enum: Status, default: Status.Disponível })
    status: Status;
    
    @Column({ default: 0 })
    views: number;

    @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.vehicles)
    @JoinColumn({ name: 'manufacturer_id' })
    manufacturer: Manufacturer;

    @ManyToOne(() => VehicleType, (vehicleType) => vehicleType.vehicles)
    @JoinColumn({ name: 'vehicle_type_id' })
    vehicleType: VehicleType;

    @ManyToOne(() => Category, (category) => category.vehicles)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @OneToMany(() => VehicleImage, (vehicleImage) => vehicleImage.vehicle)
    images: VehicleImage[];
}

export default Vehicle;
