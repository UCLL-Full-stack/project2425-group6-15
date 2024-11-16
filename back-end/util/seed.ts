import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
    await prisma.user.deleteMany();
    await prisma.interest.deleteMany();

    const hashedPassword = bcrypt.hashSync('user123', 10);


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

    const user = await prisma.user.create({
        data: {
            firstName: 'user',
            lastName: 'test',
            phoneNumber: '+32 1234567890',
            password: hashedPassword,
            email: 'user@gmail.com',
            gender: 'male',
            interests: {
                connect: [{ id: interest1.id }, { id: interest2.id }],
            },
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
