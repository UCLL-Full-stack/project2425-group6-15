import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
    await prisma.interest.deleteMany();
    await prisma.activity.deleteMany();
        
    const hashedPassword = bcrypt.hashSync('user123', 10);
    const hashedAdminPassword = bcrypt.hashSync('admin123', 10);

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
    
    const interest11 = await prisma.interest.create({
        data: {
            name: 'Hiking',
            description: 'Exploring nature through hikes',
        },
    });
    
    const interest12 = await prisma.interest.create({
        data: {
            name: 'Painting',
            description: 'Creating art with paints and brushes',
        },
    });
    
    const interest13 = await prisma.interest.create({
        data: {
            name: 'Crafting',
            description: 'DIY projects and handmade creations',
        },
    });
    
    const interest14 = await prisma.interest.create({
        data: {
            name: 'Gardening',
            description: 'Growing and caring for plants',
        },
    });
    
    const interest15 = await prisma.interest.create({
        data: {
            name: 'Fishing',
            description: 'Fishing in rivers, lakes, or seas',
        },
    });
    
    const interest16 = await prisma.interest.create({
        data: {
            name: 'Swimming',
            description: 'Enjoying and practicing swimming',
        },
    });
    
    const interest17 = await prisma.interest.create({
        data: {
            name: 'Martial Arts',
            description: 'Learning self-defense and martial arts',
        },
    });
    
    const interest18 = await prisma.interest.create({
        data: {
            name: 'Cycling',
            description: 'Riding bicycles for leisure or sport',
        },
    });
    
    const interest19 = await prisma.interest.create({
        data: {
            name: 'Volunteering',
            description: 'Helping out in community and charity work',
        },
    });
    
    const interest20 = await prisma.interest.create({
        data: {
            name: 'Chess',
            description: 'Playing and mastering the game of chess',
        },
    });
    
    const interest21 = await prisma.interest.create({
        data: {
            name: 'Podcasting',
            description: 'Creating and sharing podcasts',
        },
    });
    
    const interest22 = await prisma.interest.create({
        data: {
            name: 'Astronomy',
            description: 'Studying and observing celestial objects',
        },
    });
    
    const interest23 = await prisma.interest.create({
        data: {
            name: 'Woodworking',
            description: 'Building and crafting with wood',
        },
    });
    
    const interest24 = await prisma.interest.create({
        data: {
            name: 'Robotics',
            description: 'Designing and building robots',
        },
    });
    
    const interest25 = await prisma.interest.create({
        data: {
            name: 'Board Games',
            description: 'Playing and enjoying board games',
        },
    });
    
    const interest26 = await prisma.interest.create({
        data: {
            name: 'Acting',
            description: 'Performing in plays, movies, or shows',
        },
    });
    
    const interest27 = await prisma.interest.create({
        data: {
            name: 'Knitting',
            description: 'Creating garments and items with knitting',
        },
    });
    
    const interest28 = await prisma.interest.create({
        data: {
            name: 'Language Learning',
            description: 'Learning and practicing new languages',
        },
    });
    
    const interest29 = await prisma.interest.create({
        data: {
            name: 'Meditation',
            description: 'Practicing mindfulness and relaxation techniques',
        },
    });
    
    const interest30 = await prisma.interest.create({
        data: {
            name: 'Birdwatching',
            description: 'Observing and identifying birds in the wild',
        },
    });
    

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
            firstName: 'Maria',
            lastName: 'Garcia',
            phoneNumber: '+32 0987654321',
            password: hashedPassword,
            email: 'maria.garcia@gmail.com',
            gender: 'female',
            interests: {
                connect: [{ id: interest3.id }],
            },
        },
    });

    const user3 = await prisma.user.create({
        data: {
            firstName: 'Liam',
            lastName: 'Smith',
            phoneNumber: '+32 1122334455',
            password: hashedPassword,
            email: 'liam.smith@gmail.com',
            gender: 'male',
            interests: {
                connect: [{ id: interest1.id }, { id: interest3.id }],
            },
        },
    });

    const user4 = await prisma.user.create({
        data: {
            firstName: 'Chen',
            lastName: 'Wang',
            phoneNumber: '+32 2233445566',
            password: hashedPassword,
            email: 'chen.wang@gmail.com',
            gender: 'male',
            interests: {
                connect: [{ id: interest4.id }, { id: interest5.id }],
            },
        },
    });

    const user5 = await prisma.user.create({
        data: {
            firstName: 'Aisha',
            lastName: 'Khan',
            phoneNumber: '+32 3344556677',
            password: hashedPassword,
            email: 'aisha.khan@gmail.com',
            gender: 'female',
            interests: {
                connect: [{ id: interest6.id }, { id: interest7.id }],
            },
        },
    });

    const user6 = await prisma.user.create({
        data: {
            firstName: 'Alex',
            lastName: 'Johnson',
            phoneNumber: '+32 4455667788',
            password: hashedPassword,
            email: 'alex.johnson@gmail.com',
            gender: 'male',
            interests: {
                connect: [{ id: interest8.id }, { id: interest9.id }],
            },
        },
    });

    const user7 = await prisma.user.create({
        data: {
            firstName: 'Carlos',
            lastName: 'Martinez',
            phoneNumber: '+32 5566778899',
            password: hashedPassword,
            email: 'carlos.martinez@gmail.com',
            gender: 'male',
            interests: {
                connect: [{ id: interest10.id }, { id: interest1.id }],
            },
        },
    });

    const user8 = await prisma.user.create({
        data: {
            firstName: 'Sofia',
            lastName: 'Lopez',
            phoneNumber: '+32 6677889900',
            password: hashedPassword,
            email: 'sofia.lopez@gmail.com',
            gender: 'female',
            interests: {
                connect: [{ id: interest2.id }, { id: interest3.id }],
            },
        },
    });

    const user9 = await prisma.user.create({
        data: {
            firstName: 'Ravi',
            lastName: 'Patel',
            phoneNumber: '+32 7788990011',
            password: hashedPassword,
            email: 'ravi.patel@gmail.com',
            gender: 'male',
            interests: {
                connect: [{ id: interest4.id }, { id: interest5.id }],
            },
        },
    });

    const user10 = await prisma.user.create({
        data: {
            firstName: 'Oliver',
            lastName: 'Brown',
            phoneNumber: '+32 8899001122',
            password: hashedPassword,
            email: 'oliver.brown@gmail.com',
            gender: 'male',
            interests: {
                connect: [{ id: interest6.id }, { id: interest7.id }],
            },
        },
    });

    const userAdmin = await prisma.user.create({
        data: {
            firstName: 'admin',
            lastName: 'test',
            phoneNumber: '+32 1234567770',
            password: hashedAdminPassword,
            email: 'admin@gmail.com',
            gender:'male',
            role: 'admin',
            interests: {
                connect: [],
            },
        }});

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
            location: "6.8503|&|50.3517",
            participants: {
                connect: [{ id: user3.id }, { id: user4.id }]
            }
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
            location: "5.8503|&|50.3517",
            participants: {
                connect: [{ id: user5.id }, { id: user6.id }]
            }
        },
    });

    const post3 = await prisma.post.create({
        data: {
            title: 'Photography Walk',
            description: 'Join us for a walk and capture beautiful moments.',
            startDate: new Date('2024-12-15T10:00:00Z'),
            endDate: new Date('2024-12-15T12:00:00Z'),
            time: '10:00 AM - 12:00 PM',
            activityId: activity9.id,
            creatorId: user5.id,
            peopleNeeded: 8,
            location: "3.8503|&|50.3517",
        },
    });

    const post4 = await prisma.post.create({
        data: {
            title: 'Cooking Class',
            description: 'Learn to cook delicious meals.',
            startDate: new Date('2024-12-04T14:00:00Z'),
            endDate: new Date('2024-12-04T16:00:00Z'),
            time: '02:00 PM - 04:00 PM',
            activityId: activity11.id,
            creatorId: user6.id,
            peopleNeeded: 6,
            location: "6.9503|&|50.3517",
        },
    });

    const post5 = await prisma.post.create({
        data: {
            title: 'Board Games Night',
            description: 'Enjoy a night of fun board games.',
            startDate: new Date('2024-12-05T19:00:00Z'),
            endDate: new Date('2024-12-05T22:00:00Z'),
            time: '07:00 PM - 10:00 PM',
            activityId: activity12.id,
            creatorId: user7.id,
            peopleNeeded: 4,
            location: "6.5503|&|49.3517",
        },
    });

    const post6 = await prisma.post.create({
        data: {
            title: 'Swimming Session',
            description: 'Join us for a fun swimming session.',
            startDate: new Date('2023-11-03T10:00:00Z'),
            endDate: new Date('2023-11-03T12:00:00Z'),
            time: '10:00 AM - 12:00 PM',
            activityId: activity2.id,
            creatorId: user3.id,
            peopleNeeded: 6,
            location: "6.7503|&|50.3517",
        },
    });

    const post7 = await prisma.post.create({
        data: {
            title: 'Evening Run',
            description: 'Join us for an evening run.',
            startDate: new Date('2023-11-04T18:00:00Z'),
            endDate: new Date('2023-11-04T19:00:00Z'),
            time: '06:00 PM - 07:00 PM',
            activityId: activity6.id,
            creatorId: user4.id,
            peopleNeeded: 8,
            location: "3.7503|&|50.3517",
        },
    });

    const post8 = await prisma.post.create({
        data: {
            title: 'Gardening Workshop',
            description: 'Learn the basics of gardening.',
            startDate: new Date('2023-11-05T09:00:00Z'),
            endDate: new Date('2023-11-05T11:00:00Z'),
            time: '09:00 AM - 11:00 AM',
            activityId: activity5.id,
            creatorId: user5.id,
            peopleNeeded: 5,
            location: "6.7503|&|45.3517",
        },
    });

    const post9 = await prisma.post.create({
        data: {
            title: 'Cycling Tour',
            description: 'Join us for a cycling tour around the city.',
            startDate: new Date('2023-11-06T08:00:00Z'),
            endDate: new Date('2023-11-06T10:00:00Z'),
            time: '08:00 AM - 10:00 AM',
            activityId: activity4.id,
            creatorId: user6.id,
            peopleNeeded: 10,
            location: "4.8503|&|50.3517",
        },
    });

    const post10 = await prisma.post.create({
        data: {
            title: 'Painting Class',
            description: 'Learn to paint beautiful landscapes.',
            startDate: new Date('2023-11-07T14:00:00Z'),
            endDate: new Date('2023-11-07T16:00:00Z'),
            time: '02:00 PM - 04:00 PM',
            activityId: activity3.id,
            creatorId: user7.id,
            peopleNeeded: 6,
            location: "5.8503|&|40.3517",
        },
    });

    const post11 = await prisma.post.create({
        data: {
            title: 'Yoga Retreat',
            description: 'Join us for a weekend yoga retreat.',
            startDate: new Date('2023-11-08T08:00:00Z'),
            endDate: new Date('2023-11-08T18:00:00Z'),
            time: '08:00 AM - 06:00 PM',
            activityId: activity7.id,
            creatorId: user8.id,
            peopleNeeded: 15,
            location: "4.5503|&|50.6517",
        },
    });

    const post12 = await prisma.post.create({
        data: {
            title: 'Dance Workshop',
            description: 'Learn new dance moves.',
            startDate: new Date('2023-11-09T10:00:00Z'),
            endDate: new Date('2023-11-09T12:00:00Z'),
            time: '10:00 AM - 12:00 PM',
            activityId: activity8.id,
            creatorId: user9.id,
            peopleNeeded: 10,
            location: "4.1503|&|48.3517",
        },
    });

    const post13 = await prisma.post.create({
        data: {
            title: 'Fishing Trip',
            description: 'Join us for a relaxing fishing trip.',
            startDate: new Date('2023-11-10T06:00:00Z'),
            endDate: new Date('2023-11-10T12:00:00Z'),
            time: '06:00 AM - 12:00 PM',
            activityId: activity10.id,
            creatorId: user10.id,
            peopleNeeded: 4,
            location: "3.8503|&|52.3517",
        },
    });

    const post14 = await prisma.post.create({
        data: {
            title: 'Board Games Marathon',
            description: 'Enjoy a marathon of board games.',
            startDate: new Date('2023-11-11T10:00:00Z'),
            endDate: new Date('2023-11-11T22:00:00Z'),
            time: '10:00 AM - 10:00 PM',
            activityId: activity12.id,
            creatorId: user1.id,
            peopleNeeded: 8,
            location: "50.8503|&|4.3517",
        },
    });

    const post15 = await prisma.post.create({
        data: {
            title: 'Morning Meditation',
            description: 'Start your day with a peaceful meditation session.',
            startDate: new Date('2023-11-12T07:00:00Z'),
            endDate: new Date('2023-11-12T08:00:00Z'),
            time: '07:00 AM - 08:00 AM',
            activityId: activity7.id,
            creatorId: user2.id,
            peopleNeeded: 10,
            location: "50.8503|&|4.3517",
        },
    });

    const post16 = await prisma.post.create({
        data: {
            title: 'Evening Photography',
            description: 'Capture the beauty of the evening.',
            startDate: new Date('2023-11-13T17:00:00Z'),
            endDate: new Date('2023-11-13T19:00:00Z'),
            time: '05:00 PM - 07:00 PM',
            activityId: activity9.id,
            creatorId: user3.id,
            peopleNeeded: 6,
            location: "50.8503|&|4.3517",
        },
    });

    const post17 = await prisma.post.create({
        data: {
            title: 'Cooking Competition',
            description: 'Show off your cooking skills in a friendly competition.',
            startDate: new Date('2023-11-14T14:00:00Z'),
            endDate: new Date('2023-11-14T17:00:00Z'),
            time: '02:00 PM - 05:00 PM',
            activityId: activity11.id,
            creatorId: user4.id,
            peopleNeeded: 8,
            location: "50.8503|&|4.3517",
        },
    });

    const post18 = await prisma.post.create({
        data: {
            title: 'Fitness Bootcamp',
            description: 'Join us for an intensive fitness bootcamp.',
            startDate: new Date('2023-11-15T06:00:00Z'),
            endDate: new Date('2023-11-15T08:00:00Z'),
            time: '06:00 AM - 08:00 AM',
            activityId: activity6.id,
            creatorId: user5.id,
            peopleNeeded: 12,
            location: "50.8503|&|4.3517",
        },
    });

    const post19 = await prisma.post.create({
        data: {
            title: 'Writing Workshop',
            description: 'Improve your writing skills in this workshop.',
            startDate: new Date('2023-11-16T10:00:00Z'),
            endDate: new Date('2023-11-16T12:00:00Z'),
            time: '10:00 AM - 12:00 PM',
            activityId: activity7.id,
            creatorId: user6.id,
            peopleNeeded: 10,
            location: "50.8503|&|4.3517",
        },
    });

    const post20 = await prisma.post.create({
        data: {
            title: 'Music Jam Session',
            description: 'Join us for a fun music jam session.',
            startDate: new Date('2023-11-17T18:00:00Z'),
            endDate: new Date('2023-11-17T20:00:00Z'),
            time: '06:00 PM - 08:00 PM',
            activityId: activity4.id,
            creatorId: user7.id,
            peopleNeeded: 8,
            location: "50.8503|&|4.3517",
        },
    });

    const post21 = await prisma.post.create({
        data: {
            title: 'Art Exhibition',
            description: 'Showcase your art in this exhibition.',
            startDate: new Date('2023-11-18T10:00:00Z'),
            endDate: new Date('2023-11-18T14:00:00Z'),
            time: '10:00 AM - 02:00 PM',
            activityId: activity3.id,
            creatorId: user8.id,
            peopleNeeded: 10,
            location: "50.8503|&|4.3517",
        },
    });

    const post22 = await prisma.post.create({
        data: {
            title: 'Hiking Adventure',
            description: 'Join us for an adventurous hike.',
            startDate: new Date('2023-11-19T08:00:00Z'),
            endDate: new Date('2023-11-19T12:00:00Z'),
            time: '08:00 AM - 12:00 PM',
            activityId: activity1.id,
            creatorId: user9.id,
            peopleNeeded: 8,
            location: "50.8503|&|4.3517",
        },
    });

    const post23 = await prisma.post.create({
        data: {
            title: 'Swimming Competition',
            description: 'Compete in a friendly swimming competition.',
            startDate: new Date('2023-11-20T10:00:00Z'),
            endDate: new Date('2023-11-20T12:00:00Z'),
            time: '10:00 AM - 12:00 PM',
            activityId: activity2.id,
            creatorId: user10.id,
            peopleNeeded: 6,
            location: "50.8503|&|4.3517",
        },
    });

    const post24 = await prisma.post.create({
        data: {
            title: 'Evening Run',
            description: 'Join us for an evening run.',
            startDate: new Date('2023-11-21T18:00:00Z'),
            endDate: new Date('2023-11-21T19:00:00Z'),
            time: '06:00 PM - 07:00 PM',
            activityId: activity6.id,
            creatorId: user1.id,
            peopleNeeded: 8,
            location: "50.8503|&|4.3517",
        },
    });

    const post25 = await prisma.post.create({
        data: {
            title: 'Gardening Workshop',
            description: 'Learn the basics of gardening.',
            startDate: new Date('2023-11-22T09:00:00Z'),
            endDate: new Date('2023-11-22T11:00:00Z'),
            time: '09:00 AM - 11:00 AM',
            activityId: activity5.id,
            creatorId: user2.id,
            peopleNeeded: 5,
            location: "50.8503|&|4.3517",
        },
    });

    const post26 = await prisma.post.create({
        data: {
            title: 'Cycling Tour',
            description: 'Join us for a cycling tour around the city.',
            startDate: new Date('2023-11-23T08:00:00Z'),
            endDate: new Date('2023-11-23T10:00:00Z'),
            time: '08:00 AM - 10:00 AM',
            activityId: activity4.id,
            creatorId: user3.id,
            peopleNeeded: 10,
            location: "50.8503|&|4.3517",
        },
    });

    const post27 = await prisma.post.create({
        data: {
            title: 'Painting Class',
            description: 'Learn to paint beautiful landscapes.',
            startDate: new Date('2023-11-24T14:00:00Z'),
            endDate: new Date('2023-11-24T16:00:00Z'),
            time: '02:00 PM - 04:00 PM',
            activityId: activity3.id,
            creatorId: user4.id,
            peopleNeeded: 6,
            location: "50.8503|&|4.3517",
        },
    });

    const post28 = await prisma.post.create({
        data: {
            title: 'Yoga Retreat',
            description: 'Join us for a weekend yoga retreat.',
            startDate: new Date('2023-11-25T08:00:00Z'),
            endDate: new Date('2023-11-25T18:00:00Z'),
            time: '08:00 AM - 06:00 PM',
            activityId: activity7.id,
            creatorId: user5.id,
            peopleNeeded: 15,
            location: "50.8503|&|4.3517",
        },
    });

    const post29 = await prisma.post.create({
        data: {
            title: 'Dance Workshop',
            description: 'Learn new dance moves.',
            startDate: new Date('2023-11-26T10:00:00Z'),
            endDate: new Date('2023-11-26T12:00:00Z'),
            time: '10:00 AM - 12:00 PM',
            activityId: activity8.id,
            creatorId: user6.id,
            peopleNeeded: 10,
            location: "50.8503|&|4.3517",
        },
    });

    const post30 = await prisma.post.create({
        data: {
            title: 'Fishing Trip',
            description: 'Join us for a relaxing fishing trip.',
            startDate: new Date('2023-11-27T06:00:00Z'),
            endDate: new Date('2023-11-27T12:00:00Z'),
            time: '06:00 AM - 12:00 PM',
            activityId: activity10.id,
            creatorId: user7.id,
            peopleNeeded: 4,
            location: "50.8503|&|4.3517",
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
