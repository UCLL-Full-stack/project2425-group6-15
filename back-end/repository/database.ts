import { PrismaClient } from '@prisma/client';

const database = new PrismaClient();

database.$connect()
    .then(() => console.log('Database connected'))
    .catch((error) => console.error('Database connection error:', error));

export default database;