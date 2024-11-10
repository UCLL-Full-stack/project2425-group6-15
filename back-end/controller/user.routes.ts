/**
 * @swagger
 *   components:
 *    schemas:
 *      User:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            phoneNumber:
 *              type: integer
 *              format: int64
 *            email:
 *              type: string
 *      UserInput:
 *          type: object
 *          properties:
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            phoneNumber:
 *              type: integer
 *              format: int64
 *            email:
 *              type: string
 *            gender:
 *              type: string
 *      UserSummary:
 *          type: object
 *          properties:
 *            firstName:
 *              type: string
 *              example: "Jane"
 *            lastName:
 *              type: string
 *              example: "Doe"
 *            email:
 *              type: string
 *              example: "jane.doe@example.com"
 *            interests:
 *              type: array
 *              items:
 *                type: string
 *                example: []
 *            gender:
 *              type: string
 *              enum: [male, female, other]
 *              example: "female"
 */


import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service'; 
import authService from '../authentication/auth.service';

const userRouter = express.Router();

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     security:                    
 *       - ApiKeyAuth: []           
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();  
        res.status(200).json(users);  
    } catch (error) {
        next(error);  
    }
});

/**
 * @swagger
 * /user/{email}:
 *   get:
 *     summary: Retrieve user information by email
 *     description: Gives sertain user information by email based on the token
 *     tags: [Users]
 *     security:                    
 *       - ApiKeyAuth: []           
 *       - BearerAuth: []
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         description: The email address of the user to retrieve.
 *         schema:
 *           type: string
 *           example: "user@example.com"
 *     responses:
 *       200:
 *         description: A user object containing user details.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/User' 
 *                 - $ref: '#/components/schemas/UserSummary'
 *          
 *       404:
 *         description: User not found.
 * 
 *       500:
 *         description: Internal server error
 */
userRouter.get('/:email', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let currnentemail = authService.authenticateToken(req.headers);
        const email = req.params.email;
        
        const user = await userService.findUserByEmail(email,currnentemail);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});


/**
 * @swagger
 * /users/{id}/interests:
 *   post:
 *     summary: Add an interest to a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Interest added to user.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Some server error
 */
userRouter.post('/:id/interests', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const interestData = req.body;
        await userService.addInterestToUser(userId, interestData);
        res.status(200).json({ message: 'Interest added to user.' });
    } catch (error) {
        next(error);
    }
});

export { userRouter };