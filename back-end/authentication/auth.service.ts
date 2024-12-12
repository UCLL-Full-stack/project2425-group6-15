import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authResponse, JWTGivenToken, JWTTOKEN, UserLogin } from './auth.model';
import { AuthError } from './auth.error';
import userdb from '../repository/user.db';
import { User } from '../model/user';
import { UserInput } from '../types';

const JWT_ACCES_SECRET = process.env.JWT_ACCES_SECRET || 'secretkey'; 
const JWT_ACCES_EXPIRATION = process.env.JWT_ACCES_EXPIRATION || '10m';

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh';
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '30d';

const generateAccesToken = (email: string, fullname : string) => {
        return jwt.sign({ email, fullname }, JWT_ACCES_SECRET, { expiresIn: JWT_ACCES_EXPIRATION });
}
const generateRefreshToken = (email: string) => {
    return jwt.sign({ email }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });
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
const verifyRefreshToken = (token: JWTGivenToken): string => {
    if (!token) {
        throw new AuthError('Token is required');
    }

    try {
        const decoded = jwt.verify(token as unknown as string, JWT_REFRESH_SECRET) as { email: string };
        
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
}

const refreshToken = async (token: JWTGivenToken): Promise<JWTTOKEN> => {
    if (!token) {
        throw new AuthError('Token is required');
    }
    const email = verifyRefreshToken(token);
    const user = await userdb.getByEmail(email);
    if (!user) {
        throw new AuthError('Wrong token.', 404);
    }
    const newToken = generateAccesToken(user.getEmail(), user.getFullName());
    return newToken;
}
const login = async (data : UserLogin): Promise<authResponse> => {
    const user = await userdb.getByEmail(data.email);
    if (!user) {
        throw new AuthError('Invalid email or password', 404);
    }
    const isValid = await bcrypt.compare(data.password, user.getPassword());
    if (!isValid) {
        throw new AuthError('Invalid password', 401);
    }
    const token = generateAccesToken(user.getEmail(), user.getFullName());
    const refreshToken = generateRefreshToken(user.getEmail());
    return {token, refreshToken};
}
const register = async (data : UserInput): Promise<authResponse> => {
    const user = await userdb.getByEmail(data.email);
    if (user) {
        throw new AuthError('Email already exists', 409);
    }
    const hash = await bcrypt.hash(data.password, 10);
    data.password = hash;
    const newUser = User.fromUserinput(data);
    const savedUser :User = await userdb.create(newUser);

    const token = generateAccesToken(newUser.getEmail(), newUser.getFullName());
    const refreshToken = generateRefreshToken(newUser.getEmail());

    return {token, refreshToken};
};
export default {authenticateToken};
export {login, register ,refreshToken };