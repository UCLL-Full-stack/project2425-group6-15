import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { userRouter } from './controller/user.routes';
import { authRouter } from './controller/auth.routes';

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use((req: express.Request, res: express.Response, next) => {
    console.log(`Request Method: ${req.method}`); 
    console.log(`Request URL: ${req.url}`);
    console.log(`Request Body:`, req.body); 
    next(); 
});


app.use(cors({ origin: 'http://localhost:8080' }));
app.use(bodyParser.json());

app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});

app.use('/users', userRouter);
app.use('/auth', authRouter);

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Courses API',
            version: '1.0.0',
        },
    },
    apis: ['./controller/*.routes.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack); 
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        Body: req.body,
    });
});

app.listen(port, () => {
    console.log(`Back-end is running on port ${port}.`);
    console.log(`Swagger is running on http://localhost:${port}/api-docs`);
});
