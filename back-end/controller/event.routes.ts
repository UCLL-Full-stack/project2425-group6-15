/**
 * @swagger
 * components:
 *   schemas:
 *     PhoneNumber:
 *       type: object
 *       properties:
 *         countryCode:
 *           type: string
 *         number:
 *           type: string
 *     Role:
 *       type: string
 *       enum: [admin, user, organization]
 *     Location:
 *       type: object
 *       properties:
 *         longitude:
 *           type: string
 *         latitude:
 *           type: string
 *     AccountInput:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phoneNumber:
 *           $ref: '#/components/schemas/PhoneNumber'
 *         email:
 *           type: string
 *     EventInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         time:
 *           type: string
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         activityName:
 *           type: string
 *         peopleNeeded:
 *           type: integer
 *     EventPreview:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         activity:
 *           $ref: '#/components/schemas/Activity'
 *         creator:
 *           $ref: '#/components/schemas/AccountPreview'
 *         peopleNeeded:
 *           type: integer
 *         peopleJoined:
 *           type: integer
 *         hasJoined:
 *           type: boolean
 *     AccountPreview:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         fullname:
 *           type: string
 *         type:
 *           $ref: '#/components/schemas/Role'
 *     AccountSummary:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         interests:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Interest'
 *         role:
 *           $ref: '#/components/schemas/Role'
 *     EventSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         time:
 *           type: string
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         activity:
 *           $ref: '#/components/schemas/Activity'
 *         creator:
 *           $ref: '#/components/schemas/AccountSummary'
 *         participants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AccountSummary'
 *         peopleNeeded:
 *           type: integer
 *     PublicAccount:
 *       type: object
 *       properties:
 *         type:
 *           $ref: '#/components/schemas/Role'
 *         id:
 *           type: integer
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phoneNumber:
 *           $ref: '#/components/schemas/PhoneNumber'
 *         email:
 *           type: string
 *         interests:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Interest'
 *     PublicEvent:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         activity:
 *           $ref: '#/components/schemas/Activity'
 *         creator:
 *           $ref: '#/components/schemas/AccountSummary'
 *         participants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AccountPreview'
 *         peopleNeeded:
 *           type: integer
 *         hasJoined:
 *           type: boolean
 *     Interest:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     Activity:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         type:
 *           type: string
 */


import express, { NextFunction, Request, Response } from 'express';
import eventService from '../service/event.service';
import { EventPreview, EventSummary } from '../types';
import authService from '../authentication/auth.service';

const eventRouter = express.Router();

/**
 * @swagger
 * /event:
 *  get:
 *    summary: Get all events
 *    tags: [Events]
 *    security:                    
 *      - ApiKeyAuth: []           
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: A list of events
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/EventPreview'
 */
eventRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events: EventPreview[] = await eventService.getAllEvents(await authService.authenticateToken(req.headers));
        res.status(200).json(events);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /event/{id}:
 *  get:
 *    summary: Get a event by ID
 *    tags: [Events]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the event to return
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: A event
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EventSummary'
 *      404:
 *        description: Event not found
 */
eventRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const event: EventSummary = await eventService.getEventById(parseInt(req.params.id), await authService.authenticateToken(req.headers));
        if (event) {
            res.status(200).json(event);
        } else {
            res.status(404).send('Event not found');
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /event/{id}:
 *  delete:
 *    summary: Delete an event by ID
 *    tags: [Events]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the event to delete
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Event deleted successfully
 *      404:
 *        description: Event not found
 */
eventRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await eventService.deleteEventById(parseInt(req.params.id), await authService.authenticateToken(req.headers));
        res.status(200).json("event deleted");

    } catch (error) {
        next(error);
    }
});


/**
 * @swagger
 * /event/{id}/join:
 *  put:
 *    summary: Join a event
 *    tags: [Events]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the event to join
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Successfully joined the event
 *      404:
 *        description: Event not found
 */
eventRouter.put('/:id/join', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventId = parseInt(req.params.id);
        const event = await eventService.joinEvent(eventId, await authService.authenticateToken(req.headers));
        if (event) {
            res.status(200).json({ message: 'Successfully joined the event' });
        } else {
            res.status(404).send('Event not found');
        }
    } catch (error) {
        next(error);
    }
});


/**
 * @swagger
 * /event:
 *  post:
 *    summary: Create a new event
 *    tags: [Events]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/EventInput'
 *    responses:
 *      201:
 *        description: Event created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EventSummary'
 */
eventRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const event = await eventService.createEvent(req.body, await authService.authenticateToken(req.headers));
        res.status(201).json(event);
    } catch (error) {
        next(error);
    }
});
export { eventRouter };
