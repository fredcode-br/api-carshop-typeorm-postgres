import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import Role from "./Role";
import Permission from "./Permission";


@Entity('users')
class User extends BaseEntity {
    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: true })
    active: boolean;

    @ManyToMany(() => Role)
    @JoinTable({
        name: "users_roles",
        joinColumns: [{ name: "user_id" }],
        inverseJoinColumns: [{ name: "role_id" }],
    })
    roles: Role[];

    @ManyToMany(() => Permission)
    @JoinTable({
        name: "users_permissions",
        joinColumns: [{ name: "user_id" }],
        inverseJoinColumns: [{ name: "permission_id" }],
    })
    permissions: Permission[];
}

export default User;