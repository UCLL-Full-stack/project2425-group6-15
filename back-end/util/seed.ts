// Execute: npx ts-node util/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { set } from 'date-fns';

const prisma = new PrismaClient();

const main = async () => {
    await prisma.userInterest.deleteMany();
    await prisma.user.deleteMany();
    await prisma.interest.deleteMany();

    const hashedPassword = bcrypt.hashSync('user123', 10);

    const user = await prisma.user.create({
        data: {
            firstName: 'user',
            lastName: 'test',
            phoneNumber: '+321234567890',
            password: hashedPassword,
            email: 'user@test.com',
            gender: 'male',
        },
    });

    const interest1 = await prisma.interest.create({
        data: {
            name: 'Reading',
            description: 'Reading books and articles',
        },
    });

    const interest2 = await prisma.interest.create({
        data: {
            name: 'Traveling',
            description: 'Exploring new places and cultures',
        },
    });

    await prisma.userInterest.create({
        data: {
            userId: user.id,
            interestId: interest1.id,
        },
    });

    await prisma.userInterest.create({
        data: {
            userId: user.id,
            interestId: interest2.id,
        },
    });
};

(async () => {
    try {
        await main();
        await prisma.$disconnect();
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
})();
