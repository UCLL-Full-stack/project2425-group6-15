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
 *           example: 1  // Voorbeeld ID
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
import authService from '../service/auth.service';
import userService from '../service/user.service';
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
 *       500:
 *         description: Some server error
 */
authRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {    
    console.log(req.body);
    
    try {
        const { email, password, firstName, lastName, phoneNumber, gender } = req.body;
        const token = authService.generateToken(req.body.email);

        const hashedPassword = await bcrypt.hash(req.body.password, 10); 

        const newUser = await userService.createUser({ ...req.body, password: hashedPassword });


        res.status(200).json({ token });
    } catch (error) {        
        next(error);
    }
});

// /**
//  * @swagger
//  * /login:
//  *   post:
//  *     summary: Login a user
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: JWT token.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 token:
//  *                   type: string
//  *       401:
//  *         description: Unauthorized
//  */
// authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // Zoek gebruiker op basis van e-mail
//         const user = await userService.findUserByEmail(req.body.email); // Je moet deze functie implementeren

//         // Controleer of de gebruiker bestaat en of het wachtwoord klopt
//         if (user && (await bcrypt.compare(req.body.password, user.password))) {
//             // Maak een JWT token aan
//             const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '30m' });
//             return res.status(200).json({ token });
//         }

//         // Als de login mislukt
//         res.status(401).json({ message: 'Invalid email or password' });
//     } catch (error) {
//         next(error);
//     }
// });

export { authRouter };
