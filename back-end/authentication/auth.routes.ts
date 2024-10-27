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
 */


import express, { NextFunction, Request, Response } from 'express';
import authService from './auth.service';
import userService from '../service/user.service';
import userDB from '../repository/user.db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const authRouter = express.Router();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; 

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

        const hashedPassword = await bcrypt.hash(req.body.password, 10); 

        const newUser = await userService.createUser({ ...req.body, password: hashedPassword });

        const token = authService.generateToken(newUser.getEmail());

        res.status(200).json({ token });
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
authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userDB.getUserByEmail(req.body.email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (user && (await bcrypt.compare(req.body.password, user.getPassword()))) {
            const token = jwt.sign({ email: user.getEmail() }, JWT_SECRET, { expiresIn: '30m' });
            return res.status(200).json({ token });
        }
        
        // Als de login mislukt
        res.status(401).json({ message: 'Invalid email or password' });
    } catch (error) {
        next(error);
    }
});

export { authRouter };

