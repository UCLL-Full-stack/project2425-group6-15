import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey'; 

const generateToken = (email: string) => {
        return jwt.sign({ email }, JWT_SECRET, { expiresIn: '30m' });
    }

const verifyToken = (token: string) => {
        return jwt.verify(token, JWT_SECRET);
    }

export default {generateToken, verifyToken};
