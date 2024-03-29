import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import Permission from "./Permission";

@Entity('roles')
class Role extends BaseEntity {
    @Column()
    description: string;

    @ManyToMany(() => Permission)
    @JoinTable({
        name: "permissions_roles",
        joinColumns: [{ name: "role_id" }],
        inverseJoinColumns: [{ name: "permission_id" }],
    })
    permissions: Permission[];
}

export default Role;