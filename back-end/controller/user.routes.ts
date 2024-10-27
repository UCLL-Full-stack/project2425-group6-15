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
 *              type: string
 *            email:
 *              type: string
 *            rijkregisternummer:
 *              type: string
 *      UserInput:
 *          type: object
 *          properties:
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            phoneNumber:
 *              type: string
 *            email:
 *              type: string
 *            sex:
 *              type: string
 */

import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service'; 

const userRouter = express.Router();




/**
 * @swagger
 * /users:
 * /users:
 *   get:
 *     summary: Retrieve a list of users
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
 * /users:
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
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
userRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(200).json(newUser);
    } catch (error) {
        next(error);
    }
});


/**
 * @swagger
 * /users/{id}/interests:
 *   post:
 *     summary: Add an interest to a user
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