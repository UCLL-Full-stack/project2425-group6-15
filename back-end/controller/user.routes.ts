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
 *              type: object
 *              properties:
 *                countryCode:
 *                  type: string
 *                number:
 *                  type: string
 *            email:
 *              type: string
 *            gender:
 *              type: string
 *              enum: [male, female]
 *            interests:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Interest'
 *            posts:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Post'
 *            joinedPosts:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Post'
 *      UserInput:
 *          type: object
 *          properties:
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            phoneNumber:
 *              type: object
 *              properties:
 *                countryCode:
 *                  type: string
 *                number:
 *                  type: string
 *            email:
 *              type: string
 *            gender:
 *              type: string
 *              enum: [male, female]
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
 *                $ref: '#/components/schemas/Interest'
 *            gender:
 *              type: string
 *              enum: [male, female]
 *              example: "female"
 *      Interest:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            name:
 *              type: string
 *            description:
 *              type: string
 *      Post:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            title:
 *              type: string
 *            description:
 *              type: string
 *            startDate:
 *              type: string
 *              format: date-time
 *            endDate:
 *              type: string
 *              format: date-time
 *            time:
 *              type: string
 *            location:
 *              $ref: '#/components/schemas/Location'
 *            activity:
 *              $ref: '#/components/schemas/Activity'
 *            creator:
 *              $ref: '#/components/schemas/UserSummary'
 *            participants:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/UserSummary'
 *            peopleNeeded:
 *              type: integer
 *            preferredGender:
 *              type: string
 *              enum: [male, female, both]
 *      Activity:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            name:
 *              type: string
 *            type:
 *              type: string
 *      Location:
 *          type: object
 *          properties:
 *            longitude:
 *              type: string
 *            latitude:
 *              type: string
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
 *     tags: [User]
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
 * /user/current:
 *   get:
 *     summary: Retrieve user information of logged in user
 *     description: Gives sertain user information by email based on the token
 *     tags: [User]
 *     security:                    
 *       - ApiKeyAuth: []           
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A user object containing user details.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/User' 
 *          
 *       404:
 *         description: User not found.
 * 
 *       500:
 *         description: Internal server error
 */
userRouter.get('/current', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentuser = await authService.authenticateToken(req.headers);
        const user = await userService.findUserByEmail( currentuser.getEmail(), currentuser);
        res.status(200).json(user)
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
 *     tags: [User]
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
        const email = req.params.email;
        
        const user = await userService.findUserByEmail(email, await authService.authenticateToken(req.headers));
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});


/**
 * @swagger
 * /user/interests:
 *   post:
 *     summary: Add an interest to a user
 *     tags: [User]
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
userRouter.post('/interests', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUser = await authService.authenticateToken(req.headers);
        const interestData = req.body;
        const updatedUser = await userService.addInterestToUser(currentUser, interestData);
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
});

export { userRouter };