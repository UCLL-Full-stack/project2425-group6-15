/**
 * @swagger
 * components:
 *   schemas:
 *     PhoneNumber:
 *       type: object
 *       properties:
 *         countryCode:
 *           type: string
 *           example: "+31"  
 *         number:
 *           type: string
 *           example: "612345678"  
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *           example: 1  
 *         firstName:
 *           type: string
 *           example: "John" 
 *         lastName:
 *           type: string
 *           example: "Doe"  
 *         phoneNumber:
 *           $ref: '#/components/schemas/PhoneNumber'
 *         email:
 *           type: string
 *           example: "john.doe@example.com"  
 *         password:
 *           type: string
 *           example: "goodpassword.Example"  
 *     UserInput:
 *       type: object
 *       required:              
 *         - firstName
 *         - lastName
 *         - phoneNumber
 *         - email
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *           example: "John" 
 *         lastName:
 *           type: string
 *           example: "Doe"  
 *         phoneNumber:
 *           $ref: '#/components/schemas/PhoneNumber'
 *         email:
 *           type: string
 *           example: "john.doe@example.com"  
 *         gender:
 *           type: string
 *           example: "male" 
 *         password:
 *           type: string
 *           example: "goodpassword.Example"  
 *   responses:
 *     Unauthorized:
 *       description: Authentication information is missing or invalid
 */

import express, { NextFunction, Request, Response } from 'express';
import authService, { login, register, refreshToken, changePassword } from './auth.service';
import { error } from 'console';

const authRouter = express.Router();




/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Create a new user
 *     tags: [authentication]
 *     security:                    
 *       - ApiKeyAuth: []           
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: The created user and JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 * 
 *       500:
 *         description: Some server error
 */
authRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {      
    try {
        const { email, password, firstName, lastName, phoneNumber, gender } = req.body;
        let response = await register(req.body);
        res.status(200).json({"token":response});
    } catch (error) {        
        next(error);
    }
});
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [authentication]
 *     security:                    
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"  
 *               password:
 *                 type: string
 *                 example: "goodpassword.Example"
 *     responses:
 *       200:
 *         description: JWT token and refresh token cookie.
 *         headers:
 *           Set-Cookie:
 *             description: Refresh token cookie
 *             schema:
 *               type: string
 *               example: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbWluZC5kb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE2MzQ5MzU5NjYsImV4cCI6MTYzNDkzNjU2Nn0.6w3z3DqY0g3b4Z5t9Ql5XG; HttpOnly; Secure; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         description: Some server error
 */
authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.body;
        let response = await login(user);
        return res.status(200).json({"token":response});
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [authentication]
 *     security:                    
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "oldpassword.Example"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword.Example"
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         description: Some server error
 */
authRouter.post('/change-password', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { currentPassword, newPassword } = req.body;

        await changePassword(currentPassword, newPassword, await authService.authenticateToken(req.headers));
        
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh a user token
 *     tags: [authentication]
 *     security:                    
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         description: Some server error
 */
authRouter.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let newToken = await refreshToken(req.headers);
        return res.status(200).json({ token: newToken });
    } catch (error) {
        next(error);
    }
});

export { authRouter };

