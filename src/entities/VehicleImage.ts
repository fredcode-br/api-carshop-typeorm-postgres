import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Vehicle from "./Vehicle";

@Entity('vehicle_images')
class VehicleImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'image_url' })
    imageUrl: string;

    @Column({ default: false })
    main: boolean

    @ManyToOne(() => Vehicle, (vehicle) => vehicle.images)
    @JoinColumn({ name: 'vehicle_id' })
    vehicle: Vehicle;
}

export default VehicleImage;