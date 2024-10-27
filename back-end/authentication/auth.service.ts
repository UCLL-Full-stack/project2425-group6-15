import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWTGivenToken, JWTTOKEN } from './auth.model';
import { AuthError } from './auth.error';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey'; 

const generateToken = (email: string) => {
        return jwt.sign({ email }, JWT_SECRET, { expiresIn: '30m' });
}

const authenticateToken = (headers: { [key: string]: string | string[] | undefined }): void => {
    const authHeader = headers['authorization'];
    
    if (!authHeader || Array.isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
        throw new AuthError('Token is required');
    }

    const token = authHeader.split(' ')[1];

    verifyToken(token);
};

const verifyToken = (token: JWTGivenToken): void => {
    if (!token) {
        throw new AuthError('Token is required');
    }

    try {
        const decoded = jwt.verify(token as unknown as string, JWT_SECRET) as { email: string };
        
        if (!decoded.email) {
            throw new AuthError('Email not found in token');
        }

        return; 
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

export default {generateToken, verifyToken, authenticateToken};
