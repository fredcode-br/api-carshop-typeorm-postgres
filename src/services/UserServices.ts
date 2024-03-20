import bcrypt from "bcrypt";
import { userRepository } from "../repositories/userRepository";
import { BadRequestError } from "../helpers/api-errors";

type UserRequest = {
    id?: string;
    name: string;
    email: string;
    password: string;
    created_at?: string;
    active?: boolean;
  };

export class UerServices {
    async getAll() {
        const users = await userRepository.find();

        if(users.length == 0) {
            throw new BadRequestError('Nenhum usuário encontrado!');
        }

        const usersFound = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        return usersFound;
    }

    async getOne({ id }: Partial<UserRequest>) {
        const user = await userRepository.findOneBy({ id: Number(id) });

        if(!user) {
            throw new BadRequestError('Usuário não encontrado!');
        }

        const { password: _, ...userFound } = user;

        return userFound;
    }

    async create({ name, email, password }: UserRequest) {
        const userExists = await userRepository.findOneBy({ email });

        if (userExists) {
            throw new BadRequestError('Email já existe no sistema!');
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = userRepository.create({
            name,
            email,
            password: hashPassword,
        });

        await userRepository.save(newUser);

        const { password: _, ...user } = newUser;

        return user;
    }

    async updateUser({ id, name, email }: Partial<UserRequest>) {
        const updatedUserData = await userRepository.update(Number(id), { name, email });

        return updatedUserData;
    }

    async deleteUser({ id }: Partial<UserRequest>) {
        const user = await userRepository.delete(Number(id));
        return user;
    }

}