import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository";
import { BadRequestError, NotFoundError } from "../helpers/api-errors";

type AuthRequest = {
    id?: string;
    email: string;
    password: string;
    active?: boolean;
};

export class AuthServices {
    async loginUser( { email, password } : AuthRequest ) {
        
        const user = await userRepository.findOneBy({ email });

        if (!user) {
            throw new NotFoundError('E-mail ou senha inválidos');
        }

        const verifyPass = await bcrypt.compare(password, user.password);

        if (!verifyPass) {
            throw new BadRequestError('E-mail ou senha inválidos');
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_PASS ?? '',
            { expiresIn: '1h' }
        );
        
        const { password: _, ...userLogin } = user;

        return { 
            user: userLogin,
            token: token
        }

    }
}