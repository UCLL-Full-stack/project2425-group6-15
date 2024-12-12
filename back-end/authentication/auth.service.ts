import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authResponse, JWTGivenToken, JWTTOKEN, UserLogin } from './auth.model';
import { AuthError } from './auth.error';
import userdb from '../repository/user.db';
import { User } from '../model/user';
import { UserInput } from '../types';
import {Role}from '../types';
const JWT_ACCES_SECRET = process.env.JWT_ACCES_SECRET || 'secretkey'; 
const JWT_ACCES_EXPIRATION = process.env.JWT_ACCES_EXPIRATION || '10m';

const generateAccesToken = (email: string, fullname : string, role:Role) => {
        return jwt.sign({ email, fullname, role }, JWT_ACCES_SECRET, { expiresIn: JWT_ACCES_EXPIRATION });
}

const authenticateToken = async (headers: { [key: string]: string | string[] | undefined }): Promise<User> => {
    const authHeader = headers['authorization'];
    
    if (!authHeader || Array.isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
        throw new AuthError('Token is required');
    }

    const token = authHeader.split(' ')[1];
    const email =  verifyToken(token);
    const user = await userdb.getByEmail(email);
    if (!user) {
        throw new AuthError('Wrong token.', 404);
    }
    return user;
};



const verifyToken = (token: JWTGivenToken): string => {
    if (!token) {
        throw new AuthError('Token is required');
    }

    try {
        const decoded = jwt.verify(token as unknown as string, JWT_ACCES_SECRET) as { email: string };
        
        if (!decoded.email) {
            throw new AuthError('Email not found in token');
        }

        return decoded.email; 
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new AuthError('Invalid token');
        }
        if (error instanceof jwt.TokenExpiredError) {
            throw new AuthError('Token has expired');
        }
        throw new AuthError('Token verification failed');
    }
};

const refreshToken = async (headers: { [key: string]: string | string[] | undefined }): Promise<JWTGivenToken> => {
    const authHeader = headers['authorization'];
    
    if (!authHeader || Array.isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
        throw new AuthError('Token is required');
    }

    const token = authHeader.split(' ')[1];
    const email =  verifyToken(token);
    const user = await userdb.getByEmail(email);
    if (!user) {
        throw new AuthError('Wrong token.', 404);
    }
    const newToken = generateAccesToken(user.getEmail(), user.getFullName(),user.getRole());
    return newToken;
};
const login = async (data : UserLogin): Promise<JWTGivenToken> => {
    const user = await userdb.getByEmail(data.email);
    if (!user) {
        throw new AuthError('Invalid email or password', 404);
    }
    const isValid = await bcrypt.compare(data.password, user.getPassword());
    if (!isValid) {
        throw new AuthError('Invalid password', 401);
    }
    const token = generateAccesToken(user.getEmail(), user.getFullName(), user.getRole());
    return token;
}
const register = async (data : UserInput): Promise<JWTGivenToken> => {
    const user = await userdb.getByEmail(data.email);
    if (user) {
        throw new AuthError('Email already exists', 409);
    }
    const hash = await bcrypt.hash(data.password, 10);
    data.password = hash;
    const newUser = User.fromUserinput(data);
    const savedUser :User = await userdb.create(newUser);

    const token = generateAccesToken(newUser.getEmail(), newUser.getFullName(), newUser.getRole());

    return token;
};
export default {authenticateToken};
export {login, register ,refreshToken };