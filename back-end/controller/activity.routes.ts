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
import activityService from '../service/activity.service';
import authService from '../authentication/auth.service';

const activityRouter = express.Router();

/**
 * @swagger
 * /activity:
 *   get:
 *     summary: Retrieve a list of activities
 *     tags: [Activity]
 *     security:                    
 *       - ApiKeyAuth: []    
 *       - BearerAuth: []       
 *     responses:
 *       200:
 *         description: A list of activities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Activity'
 *       500:
 *         description: Internal server error
 */
activityRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const activities = await activityService.getAllActivities(await authService.authenticateToken(req.headers));  
        res.status(200).json(activities);  
    } catch (error) {
        next(error);  
    }
});


/**
 * @swagger
 * /activity:
 *   post:
 *     summary: Create a new activity
 *     tags: [Activity]
 *     security:                    
 *       - ApiKeyAuth: []
 *       - BearerAuth: []           
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Activity'
 *     responses:
 *       201:
 *         description: Activity created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Activity'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
activityRouter.get('/admin', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const activities = await activityService.getAllActivitiesForAdmin(await authService.authenticateToken(req.headers));  
        res.status(200).json(activities);  
    } catch (error) {
        next(error);  
    }
});

/**
 * @swagger
 * /activity:
 *   post:
 *     summary: Create a new activity
 *     tags: [Activity]
 *     security:                    
 *       - ApiKeyAuth: []
 *       - BearerAuth: []           
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Activity'
 *     responses:
 *       201:
 *         description: Activity created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Activity'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
activityRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await activityService.deleteActivity(parseInt(req.params.id), await authService.authenticateToken(req.headers));  
        res.status(200).send();  
    } catch (error) {
        next(error);  
    }
});

export { activityRouter };
