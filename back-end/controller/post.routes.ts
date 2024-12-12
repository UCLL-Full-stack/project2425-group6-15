/**
 * @swagger
 * components:
 *   schemas:
 *     UserInput:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phoneNumber:
 *           type: object
 *           properties:
 *             countryCode:
 *               type: string
 *             number:
 *               type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         gender:
 *           type: string
 *           enum: [male, female]
 *     UserSummary:
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
 *         gender:
 *           type: string
 *           enum: [male, female]
 *     Gender:
 *       type: string
 *       enum: [male, female]
 *     PhoneNumber:
 *       type: object
 *       properties:
 *         countryCode:
 *           type: string
 *         number:
 *           type: string
 *     Location:
 *       type: object
 *       properties:
 *         longitude:
 *           type: string
 *         latitude:
 *           type: string
 *     PostSummary:
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
 *           $ref: '#/components/schemas/UserSummary'
 *         participants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserSummary'
 *         peopleNeeded:
 *           type: integer
 *         preferredGender:
 *           type: string
 *           enum: [male, female, any]
 *     PostInput:
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
 *         activity:
 *           $ref: '#/components/schemas/Activity'
 *         peopleNeeded:
 *           type: integer
 *         preferredGender:
 *           type: string
 *           enum: [male, female, any]
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
import postService from '../service/post.service';
import { PostPrevieuw, PostSummary } from '../types';
import authService from '../authentication/auth.service';

const postRouter = express.Router();

/**
 * @swagger
 * /post:
 *  get:
 *    summary: Get all posts
 *    tags: [Posts]
 *    security:                    
 *      - ApiKeyAuth: []           
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: A list of posts
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/PostSummary'
 */
postRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts: PostPrevieuw[] = await postService.getAllPosts(await authService.authenticateToken(req.headers));
        res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /post/{id}:
 *  get:
 *    summary: Get a post by ID
 *    tags: [Posts]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the post to return
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: A post
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PostSummary'
 *      404:
 *        description: Post not found
 */
postRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post: PostSummary = await postService.getPostById(parseInt(req.params.id), await authService.authenticateToken(req.headers));
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).send('Post not found');
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /post/{id}/join:
 *  post:
 *    summary: Join a post
 *    tags: [Posts]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the post to join
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Successfully joined the post
 *      404:
 *        description: Post not found
 */
postRouter.post('/:id/join', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postId = parseInt(req.params.id);
        const post = await postService.joinPost(postId, await authService.authenticateToken(req.headers));
        if (post) {
            res.status(200).json({ message: 'Successfully joined the post' });
        } else {
            res.status(404).send('Post not found');
        }
    } catch (error) {
        next(error);
    }
});


/**
 * @swagger
 * /post:
 *  post:
 *    summary: Create a new post
 *    tags: [Posts]
 *    security:
 *      - ApiKeyAuth: []
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/PostInput'
 *    responses:
 *      201:
 *        description: Post created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PostSummary'
 */
postRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await postService.createPost(req.body, await authService.authenticateToken(req.headers));
        res.status(201).json(post);
    } catch (error) {
        next(error);
    }
});
export { postRouter };
