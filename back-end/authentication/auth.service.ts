import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWTGivenToken, JWTTOKEN, UserLogin } from './auth.model';
import { AuthError } from './auth.error';
import userdb from '../repository/user.db';
import { User } from '../model/user';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey'; 

const generateToken = (email: string) => {
        return jwt.sign({ email }, JWT_SECRET, { expiresIn: '30m' });
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
        throw new AuthError('User not found', 404);
    }
    return user;
};

const verifyToken = (token: JWTGivenToken): string => {
    if (!token) {
        throw new AuthError('Token is required');
    }

    try {
        const decoded = jwt.verify(token as unknown as string, JWT_SECRET) as { email: string };
        
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
const login = async (data : UserLogin): Promise<JWTTOKEN> => {
    const user = await userdb.getByEmail(data.email);
    if (!user) {
        throw new AuthError('User not found', 404);
    }
    const isValid = await bcrypt.compare(data.password, user.getPassword());
    if (!isValid) {
        throw new AuthError('Invalid password', 401);
    }
    const token = generateToken(user.getEmail());
    return token;
}
export default {generateToken, verifyToken, authenticateToken, login};
