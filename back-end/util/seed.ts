import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
    await prisma.participant.deleteMany();
    await prisma.post.deleteMany();
    await prisma.participant.deleteMany();
    await prisma.user.deleteMany();
    await prisma.interest.deleteMany();
    await prisma.activity.deleteMany();
        
    const hashedPassword = bcrypt.hashSync('user123', 10);

    const activity1 = await prisma.activity.create({
        data: {
            name: 'Hiking',
            type: 'Sport',
        },
    });

    const activity2 = await prisma.activity.create({
        data: {
            name: 'Swimming',
            type: 'Sport',
        },
    });

    const activity3 = await prisma.activity.create({
        data: {
            name: 'Painting',
            type: 'Art',
        },
    });

    const activity4 = await prisma.activity.create({
        data: {
            name: 'Cycling',
            type: 'Sport',
        },
    });

    const activity5 = await prisma.activity.create({
        data: {
            name: 'Gardening',
            type: 'Hobby',
        },
    });

    const activity6 = await prisma.activity.create({
        data: {
            name: 'Running',
            type: 'Sport',
        },
    });

    const activity7 = await prisma.activity.create({
        data: {
            name: 'Yoga',
            type: 'Wellness',
        },
    });

    const activity8 = await prisma.activity.create({
        data: {
            name: 'Dancing',
            type: 'Art',
        },
    });

    const activity9 = await prisma.activity.create({
        data: {
            name: 'Photography',
            type: 'Art',
        },
    });

    const activity10 = await prisma.activity.create({
        data: {
            name: 'Fishing',
            type: 'Hobby',
        },
    });

    const activity11 = await prisma.activity.create({
        data: {
            name: 'Cooking Class',
            type: 'Hobby',
        },
    });

    const activity12 = await prisma.activity.create({
        data: {
            name: 'Board Games',
            type: 'Hobby',
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

    const interest3 = await prisma.interest.create({
        data: {
            name: 'Cooking',
            description: 'Preparing and experimenting with food',
        },
    });

    const interest4 = await prisma.interest.create({
        data: {
            name: 'Music',
            description: 'Listening to and playing music',
        },
    });

    const interest5 = await prisma.interest.create({
        data: {
            name: 'Gaming',
            description: 'Playing video games',
        },
    });

    const interest6 = await prisma.interest.create({
        data: {
            name: 'Fitness',
            description: 'Working out and staying fit',
        },
    });

    const interest7 = await prisma.interest.create({
        data: {
            name: 'Writing',
            description: 'Writing stories and articles',
        },
    });

    const interest8 = await prisma.interest.create({
        data: {
            name: 'Photography',
            description: 'Taking and editing photos',
        },
    });

    const interest9 = await prisma.interest.create({
        data: {
            name: 'Dancing',
            description: 'Learning and performing dance',
        },
    });

    const interest10 = await prisma.interest.create({
        data: {
            name: 'Yoga',
            description: 'Practicing yoga and meditation',
        },
    });

    const user1 = await prisma.user.create({
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

    const user2 = await prisma.user.create({
        data: {
            firstName: 'user2',
            lastName: 'test2',
            phoneNumber: '+32 0987654321',
            password: hashedPassword,
            email: 'user2@gmail.com',
            gender: 'female',
            interests: {
                connect: [{ id: interest3.id }],
            },
        },
    });

    const user3 = await prisma.user.create({
        data: {
            firstName: 'user3',
            lastName: 'test3',
            phoneNumber: '+32 1122334455',
            password: hashedPassword,
            email: 'user3@gmail.com',
            gender: 'non-binary',
            interests: {
                connect: [{ id: interest1.id }, { id: interest3.id }],
            },
        },
    });

    const user4 = await prisma.user.create({
        data: {
            firstName: 'user4',
            lastName: 'test4',
            phoneNumber: '+32 2233445566',
            password: hashedPassword,
            email: 'user4@gmail.com',
            gender: 'male',
            interests: {
                connect: [{ id: interest4.id }, { id: interest5.id }],
            },
        },
    });

    const user5 = await prisma.user.create({
        data: {
            firstName: 'user5',
            lastName: 'test5',
            phoneNumber: '+32 3344556677',
            password: hashedPassword,
            email: 'user5@gmail.com',
            gender: 'female',
            interests: {
                connect: [{ id: interest6.id }, { id: interest7.id }],
            },
        },
    });

    const user6 = await prisma.user.create({
        data: {
            firstName: 'user6',
            lastName: 'test6',
            phoneNumber: '+32 4455667788',
            password: hashedPassword,
            email: 'user6@gmail.com',
            gender: 'non-binary',
            interests: {
                connect: [{ id: interest8.id }, { id: interest9.id }],
            },
        },
    });

    const user7 = await prisma.user.create({
        data: {
            firstName: 'user7',
            lastName: 'test7',
            phoneNumber: '+32 5566778899',
            password: hashedPassword,
            email: 'user7@gmail.com',
            gender: 'male',
            interests: {
                connect: [{ id: interest10.id }, { id: interest1.id }],
            },
        },
    });

    const user8 = await prisma.user.create({
        data: {
            firstName: 'user8',
            lastName: 'test8',
            phoneNumber: '+32 6677889900',
            password: hashedPassword,
            email: 'user8@gmail.com',
            gender: 'female',
            interests: {
                connect: [{ id: interest2.id }, { id: interest3.id }],
            },
        },
    });

    const user9 = await prisma.user.create({
        data: {
            firstName: 'user9',
            lastName: 'test9',
            phoneNumber: '+32 7788990011',
            password: hashedPassword,
            email: 'user9@gmail.com',
            gender: 'non-binary',
            interests: {
                connect: [{ id: interest4.id }, { id: interest5.id }],
            },
        },
    });

    const user10 = await prisma.user.create({
        data: {
            firstName: 'user10',
            lastName: 'test10',
            phoneNumber: '+32 8899001122',
            password: hashedPassword,
            email: 'user10@gmail.com',
            gender: 'male',
            interests: {
                connect: [{ id: interest6.id }, { id: interest7.id }],
            },
        },
    });

    const post1 = await prisma.post.create({
        data: {
            title: 'Morning Hike',
            description: 'Join us for a refreshing morning hike.',
            startDate: new Date('2023-11-01T08:00:00Z'),
            endDate: new Date('2023-11-01T12:00:00Z'),
            time: '08:00 AM - 12:00 PM',
            activityId: activity1.id,
            creatorId: user2.id,
            peopleNeeded: 5,
            preferredGender: 'any',
            location: "50.8503|&|4.3517",
        },
    });

    const post2 = await prisma.post.create({
        data: {
            title: 'Evening Yoga',
            description: 'Relax and unwind with an evening yoga session.',
            startDate: new Date('2023-11-02T18:00:00Z'),
            endDate: new Date('2023-11-02T19:30:00Z'),
            time: '06:00 PM - 07:30 PM',
            activityId: activity7.id,
            creatorId: user4.id,
            peopleNeeded: 10,
            preferredGender: 'any',
            location: "50.8503|&|4.3517",
        },
    });

    const post3 = await prisma.post.create({
        data: {
            title: 'Photography Walk',
            description: 'Join us for a walk and capture beautiful moments.',
            startDate: new Date('2023-11-03T10:00:00Z'),
            endDate: new Date('2023-11-03T12:00:00Z'),
            time: '10:00 AM - 12:00 PM',
            activityId: activity9.id,
            creatorId: user5.id,
            peopleNeeded: 8,
            preferredGender: 'any',
            location: "50.8503|&|4.3517",
        },
    });

    const post4 = await prisma.post.create({
        data: {
            title: 'Cooking Class',
            description: 'Learn to cook delicious meals.',
            startDate: new Date('2023-11-04T14:00:00Z'),
            endDate: new Date('2023-11-04T16:00:00Z'),
            time: '02:00 PM - 04:00 PM',
            activityId: activity11.id,
            creatorId: user6.id,
            peopleNeeded: 6,
            preferredGender: 'any',
            location: "50.8503|&|4.3517",
        },
    });

    const post5 = await prisma.post.create({
        data: {
            title: 'Board Games Night',
            description: 'Enjoy a night of fun board games.',
            startDate: new Date('2023-11-05T19:00:00Z'),
            endDate: new Date('2023-11-05T22:00:00Z'),
            time: '07:00 PM - 10:00 PM',
            activityId: activity12.id,
            creatorId: user7.id,
            peopleNeeded: 4,
            preferredGender: 'any',
            location: "50.8503|&|4.3517",
        },
    });

    await prisma.participant.create({
        data: {
            postId: post1.id,
            userId: user3.id,
            status: "accepted",
        },
    });

    await prisma.participant.create({
        data: {
            postId: post2.id,
            userId: user8.id,
            status: "accepted",
        },
    });

    await prisma.participant.create({
        data: {
            postId: post3.id,
            userId: user9.id,
            status: "accepted",
        },
    });

    await prisma.participant.create({
        data: {
            postId: post4.id,
            userId: user10.id,
            status: "accepted",
        },
    });

    await prisma.participant.create({
        data: {
            postId: post5.id,
            userId: user1.id,
            status: "accepted",
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
