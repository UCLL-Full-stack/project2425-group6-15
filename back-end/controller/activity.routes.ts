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
