/**
 * @swagger
 *   components:
 *    schemas:
 *      Account:
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
 *            interests:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Interest'
 *            events:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Event'
 *            joinedEvents:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Event'
 *      AccountInput:
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
 *      AccountSummary:
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
 *      Event:
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
 *            location:
 *              $ref: '#/components/schemas/Location'
 *            activity:
 *              $ref: '#/components/schemas/Activity'
 *            creator:
 *              $ref: '#/components/schemas/AccountSummary'
 *            participants:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/AccountSummary'
 *            peopleNeeded:
 *              type: integer
 *            preferredGender:
 *              type: string
 *              enum: [male, female, any]
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
import accountService from '../service/account.service'; 
import authService from '../authentication/auth.service';

const accountRouter = express.Router();

/**
 * @swagger
 * /account:
 *   get:
 *     summary: Retrieve a list of accounts
 *     tags: [Account]
 *     security:                    
 *       - ApiKeyAuth: []           
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Account'
 *       500:
 *         description: Internal server error
 */
accountRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accounts = await accountService.getAllAccounts();  
        res.status(200).json(accounts);  
    } catch (error) {
        next(error);  
    }
});

accountRouter.put('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accountData = req.body;
        const updatedAccount = await accountService.updateAccount(accountData, await authService.authenticateToken(req.headers));
        res.status(200).json(updatedAccount);
    } catch (error) {
        next(error);
    }
});


/**
 * @swagger
 * /account/me:
 *   get:
 *     summary: Retrieve account information of logged in account
 *     description: Gives sertain account information by email based on the token
 *     tags: [Account]
 *     security:                    
 *       - ApiKeyAuth: []           
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A account object containing account details.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Account' 
 *          
 *       404:
 *         description: Account not found.
 * 
 *       500:
 *         description: Internal server error
 */
accountRouter.get('/me', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const account = await accountService.getCurrentAccount(await authService.authenticateToken(req.headers));
        res.status(200).json(account)
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /account/interests:
 *   post:
 *     summary: Add an interest to a account
 *     tags: [Account]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: string
 *               example: "Swimming"
 *     responses:
 *       200:
 *         description: Interest added to account.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       404:
 *         description: Account not found.
 *       500:
 *         description: Some server error
 */
accountRouter.post('/interests', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const interestData = req.body;
        const updatedAccount = await accountService.changeInterestOfAccount(await authService.authenticateToken(req.headers), interestData);
        res.status(200).json(updatedAccount);
    } catch (error) {
        next(error);
    }
});

export { accountRouter };