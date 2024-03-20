import { Column, Entity } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity('permissions')
class Permission extends BaseEntity {
    @Column()
    description: string;
}

export default Permission;