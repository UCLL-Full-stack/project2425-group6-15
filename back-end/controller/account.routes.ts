/**
 * @swagger
 *   components:
 *    schemas:
 *      PhoneNumber:
 *          type: object
 *          properties:
 *            countryCode:
 *              type: string
 *            number:
 *              type: string
 *      JWTTOKEN:
 *          type: string
 *      JWTGivenToken:
 *          oneOf:
 *            - type: string
 *            - type: array
 *              items:
 *                type: string
 *            - type: "null"
 *      Role:
 *          type: string
 *          enum: [admin, user, organization]
 *      Location:
 *          type: object
 *          properties:
 *            longitude:
 *              type: string
 *            latitude:
 *              type: string
 *      Activity:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *            name:
 *              type: string
 *            type:
 *              type: string
 *      ActivitySummary:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *            name:
 *              type: string
 *            type:
 *              type: string
 *            events:
 *              type: number
 *      Interest:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *            name:
 *              type: string
 *            description:
 *              type: string
 *      InterestSummary:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *            name:
 *              type: string
 *            description:
 *              type: string
 *            accounts:
 *              type: number
 *      AccountLogin:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *      AccountRegistraion:
 *          type: object
 *          properties:
 *            type:
 *              type: string
 *              enum: [user, organization]
 *            username:
 *              type: string
 *            firstName:
 *              type: string
 *              nullable: true
 *            lastName:
 *              type: string
 *              nullable: true
 *            phoneNumber:
 *              $ref: '#/components/schemas/PhoneNumber'
 *            email:
 *              type: string
 *            password:
 *              type: string
 *      AccountInput:
 *          type: object
 *          properties:
 *            username:
 *              type: string
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            phoneNumber:
 *              $ref: '#/components/schemas/PhoneNumber'
 *            email:
 *              type: string
 *      EventInput:
 *          type: object
 *          properties:
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
 *            activityName:
 *              type: string
 *            peopleNeeded:
 *              type: number
 *      EventPreview:
 *          type: object
 *          properties:
 *            id:
 *              type: number
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
 *              $ref: '#/components/schemas/AccountPreview'
 *            peopleNeeded:
 *              type: number
 *            peopleJoined:
 *              type: number
 *            hasJoined:
 *              type: boolean
 *      AccountPreview:
 *          type: object
 *          properties:
 *            username:
 *              type: string
 *            email:
 *              type: string
 *            fullname:
 *              type: string
 *            type:
 *              $ref: '#/components/schemas/Role'
 *      AccountSummary:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *            type:
 *              $ref: '#/components/schemas/Role'
 *            username:
 *              type: string
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            email:
 *              type: string
 *            interests:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Interest'
 *      EventSummary:
 *          type: object
 *          properties:
 *            id:
 *              type: number
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
 *              $ref: '#/components/schemas/AccountSummary'
 *            participants:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/AccountSummary'
 *            peopleNeeded:
 *              type: number
 *            hasJoined:
 *              type: boolean
 *      PublicAccount:
 *          type: object
 *          properties:
 *            type:
 *              $ref: '#/components/schemas/Role'
 *            id:
 *              type: number
 *            username:
 *              type: string
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            phoneNumber:
 *              $ref: '#/components/schemas/PhoneNumber'
 *            email:
 *              type: string
 *            interests:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Interest'
 *            events:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/PublicEvent'
 *            joinedEvents:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/PublicEvent'
 *      PublicEvent:
 *          type: object
 *          properties:
 *            id:
 *              type: number
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
 *                $ref: '#/components/schemas/AccountPreview'
 *            peopleNeeded:
 *              type: number
 *            hasJoined:
 *              type: boolean
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
        const accounts = await accountService.getAllAccounts(await authService.authenticateToken(req.headers));  
        res.status(200).json(accounts);  
    } catch (error) {
        next(error);  
    }
});

/**
 * @swagger
 * /account/{id}:
 *   get:
 *     summary: Retrieve a account by id
 *     tags: [Account]
 *     security:                    
 *       - ApiKeyAuth: []           
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id of the account to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A account object containing account details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       404:
 *         description: Account not found.
 *       500:
 *         description: Internal server error
 */
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