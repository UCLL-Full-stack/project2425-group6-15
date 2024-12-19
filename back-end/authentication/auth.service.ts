import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authResponse, JWTGivenToken, JWTTOKEN, AccountLogin, AccountRegistraion } from './auth.model';
import { AuthError } from './auth.error';
import accountdb from '../repository/account.db';
import { Account } from '../model/account';
import { AccountInput } from '../types';
import {Role}from '../types';
const JWT_ACCES_SECRET = process.env.JWT_ACCES_SECRET || 'secretkey'; 
const JWT_ACCES_EXPIRATION = process.env.JWT_ACCES_EXPIRATION || '10m';

const generateAccesToken = (email: string, fullname : string, accountType:Role) => {
        return jwt.sign({ email, fullname, accountType }, JWT_ACCES_SECRET, { expiresIn: JWT_ACCES_EXPIRATION });
}

const authenticateToken = async (headers: { [key: string]: string | string[] | undefined }): Promise<Account> => {
    const authHeader = headers['authorization'];
    
    if (!authHeader || Array.isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
        throw new AuthError('Token is required');
    }

    const token = authHeader.split(' ')[1];
    const email =  verifyToken(token);
    const account = await accountdb.getByEmail(email);
    if (!account) {
        throw new AuthError('Wrong token.', 404);
    }
    return account;
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
    const account = await accountdb.getByEmail(email);
    if (!account) {
        throw new AuthError('Wrong token.', 404);
    }
    const newToken = generateAccesToken(account.getEmail(), account.getFullName(),account.getType());
    return newToken;
};
const login = async (data : AccountLogin): Promise<JWTGivenToken> => {
    const account = await accountdb.getByEmail(data.email);
    if (!account) {
        throw new AuthError('Invalid email or password', 404);
    }
    const isValid = await bcrypt.compare(data.password, account.getPassword());
    if (!isValid) {
        throw new AuthError('Invalid password', 401);
    }
    const token = generateAccesToken(account.getEmail(), account.getFullName(), account.getType());
    return token;
}
const register = async (data : AccountRegistraion): Promise<JWTGivenToken> => {
    const account = await accountdb.getByEmail(data.email);
    if (account) {
        throw new AuthError('Email already exists', 409);
    }
    const hash = await bcrypt.hash(data.password, 10);
    data.password = hash;
    const newAccount = Account.fromAccountRegistraion(data);
    const savedAccount :Account = await accountdb.create(newAccount);

    const token = generateAccesToken(newAccount.getEmail(), newAccount.getFullName(), newAccount.getType());

    return token;
};
const changePassword = async (oldPassword: string, newPassword: string, loggedinAccount: Account): Promise<void> => {
    const isValid = await bcrypt.compare(oldPassword, loggedinAccount.getPassword());
    if (!isValid) {
        throw new AuthError('Invalid password', 401);
    }
    const hash = await bcrypt.hash(newPassword, 10);
    loggedinAccount.setPassword(hash);
    await accountdb.update(loggedinAccount);
}


export default {authenticateToken};
export {login, register ,refreshToken, changePassword};