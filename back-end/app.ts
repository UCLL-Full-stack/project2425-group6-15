import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { userRouter } from './controller/user.routes';

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cors({ origin: 'http://localhost:8080' }));
app.use(bodyParser.json());

app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});

app.listen(port || 3000, () => {
    console.log(`Back-end is running on port ${port}.`);
    console.log(`Swagger is running on http://localhost:${port}/api-docs`);
});

app.use('/users',userRouter);

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