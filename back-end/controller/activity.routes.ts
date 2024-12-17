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
import activityService from '../service/activity.service';

const activityRouter = express.Router();

/**
 * @swagger
 * /activity:
 *   get:
 *     summary: Retrieve a list of activities
 *     tags: [Activity]
 *     security:                    
 *       - ApiKeyAuth: []           
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
        const activities = await activityService.getAllActivities();  
        res.status(200).json(activities);  
    } catch (error) {
        next(error);  
    }
});
export { activityRouter };
