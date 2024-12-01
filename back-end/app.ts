import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { userRouter } from './controller/user.routes';
import { authRouter } from './authentication/auth.routes';
import { activityRouter } from './controller/activity.routes';
import { postRouter } from './controller/post.routes';

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;
const API_KEY = process.env.API_KEY || 'default_api_key_here';

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'x-api-key', 'Authorization'],
    credentials: true, 
}));

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Courses API',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                    description: 'Voer hier je API-sleutel in',
                },
                BearerAuth: {
                    type: 'http',
                    name: 'bearer',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }

            },
            responses: {
                Unauthorized: { 
                    description: "Unauthorized, invalid or missing authentication JWT token/API-KEY."
                }
            }
        },
        security: [
            {
                BearerAuth: []
            }
        ]
    },
    apis: ['./authentication/*.routes.ts','./controller/*.routes.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
        authAction: {
            ApiKeyAuth: {
                name: 'x-api-key',
                schema: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                },
                value: API_KEY 
            }
        }
    }
}));

app.use((req: express.Request, res: express.Response, next) => {
    console.log(`Request Method: ${req.method}`); 
    console.log(`Request URL: ${req.url}`);
    console.log(`Request Body:`, req.body); 
    res.on('finish', () => {
        console.log(`Response Status Code: ${res.statusCode}`);
    });
    next(); 
});

app.use((req: express.Request, res: express.Response, next) => {
    const apiKey = req.headers['x-api-key'];    
    if (req.url.startsWith('/api-docs')) {
        next();
    }
    if (apiKey === API_KEY) {
        next();
    } else {
        res.status(403).json({ message: 'Invalid API Key' });
    }
});

app.use(bodyParser.json());

app.get('/status', (_req, res) => {
    res.json({ message: 'Back-end is running...' });
});

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/activity', activityRouter);
app.use('/post', postRouter);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    // console.error(err.stack); 
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

app.listen(port, async () => {
    console.log(`Back-end is running on port ${port}.`);
    console.log(`Swagger is running on http://localhost:${port}/api-docs`);
});
