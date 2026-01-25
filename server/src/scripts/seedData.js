const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // ===================================
    // 1. CLEANUP (Optional - be careful in prod)
    // ===================================
    // await prisma.event.deleteMany({});
    // await prisma.dSASheet.deleteMany({});
    // await prisma.roadmap.deleteMany({});
    // await prisma.eventCategory.deleteMany({});

    // ===================================
    // 2. EVENT CATEGORIES & TYPES
    // ===================================
    console.log('Creating Categories...');

    const hackathonCategory = await prisma.eventCategory.upsert({
        where: { slug: 'hackathons' },
        update: {},
        create: {
            name: 'Hackathons',
            slug: 'hackathons',
            description: 'Competitive coding events',
            icon: 'Trophy',
            color: '#F59E0B'
        }
    });

    const workshopCategory = await prisma.eventCategory.upsert({
        where: { slug: 'workshops' },
        update: {},
        create: {
            name: 'Workshops',
            slug: 'workshops',
            description: 'Learning sessions',
            icon: 'BookOpen',
            color: '#3B82F6'
        }
    });

    // ===================================
    // 3. EVENTS
    // ===================================
    console.log('Creating Events...');

    // Free Hackathon
    await prisma.event.upsert({
        where: { slug: 'nxtgen-coding-challenge-2026' },
        update: {
            slug: 'nxtgen-coding-challenge-2026' // Ensure slug is updated/kept
        },
        create: {
            title: 'NxtGen Coding Challenge 2026',
            slug: 'nxtgen-coding-challenge-2026',
            description: 'Join the biggest coding challenge of the year! Solve complex algorithmic problems and win exciting prizes. Open to all college students.',
            categoryId: hackathonCategory.id,
            eventType: 'coding_contest',
            mode: 'online',
            registrationStart: new Date('2026-01-01'),
            registrationEnd: new Date('2026-02-15'),
            eventStart: new Date('2026-02-20T10:00:00Z'),
            eventEnd: new Date('2026-02-20T18:00:00Z'),
            isTeamEvent: false,
            isPaid: false,
            status: 'active',
            isFeatured: true,
            maxParticipants: 500,
            prizes: [
                "1st Prize: MacBook Air",
                "2nd Prize: iPad Air",
                "3rd Prize: Mechanical Keyboard"
            ],
            rules: "1. No plagiarism allowed.\n2. Code must be submitted within time limit.",
            bannerImage: "https://images.unsplash.com/photo-1504384308090-c54be3855463?q=80&w=1200&auto=format&fit=crop"
        }
    });

    // Paid C++ Workshop
    await prisma.event.upsert({
        where: { slug: 'advanced-cpp-masterclass' },
        update: {
            slug: 'advanced-cpp-masterclass'
        },
        create: {
            title: 'Advanced C++ Masterclass',
            slug: 'advanced-cpp-masterclass',
            description: 'Deep dive into Modern C++ (C++17/20). Learn memory management, templates, and STL in depth. Perfect for competitive programmers and system developers.',
            categoryId: workshopCategory.id,
            eventType: 'workshop',
            mode: 'online',
            registrationStart: new Date('2026-01-10'),
            registrationEnd: new Date('2026-02-25'),
            eventStart: new Date('2026-03-01T09:00:00Z'),
            eventEnd: new Date('2026-03-02T17:00:00Z'),
            isTeamEvent: false,
            isPaid: true,
            registrationFee: 499.00,
            currency: 'INR',
            status: 'active',
            isFeatured: true,
            maxParticipants: 100,
            resourceLinks: {
                "syllabus": "https://example.com/syllabus.pdf"
            },
            bannerImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop"
        }
    });

    // ===================================
    // 4. DSA DATA (Curated Sheet)
    // ===================================
    console.log('Creating DSA Sheet...');

    const dsaSheet = await prisma.dSASheet.create({
        data: {
            title: 'NxtGen DSA Cracker',
            description: 'The ultimate DSA sheet to crack product-based companies. 450+ filtered questions.',
            level: 'Advanced',
            topics: {
                create: [
                    {
                        title: 'Arrays & Vectors',
                        order: 1,
                        problems: {
                            create: [
                                {
                                    title: 'Two Sum',
                                    description: 'Find two numbers that add up to a specific target.',
                                    difficulty: 'Easy',
                                    order: 1,
                                    solutions: {
                                        create: { language: 'cpp', code: 'class Solution { ... }' }
                                    }
                                },
                                {
                                    title: 'Best Time to Buy and Sell Stock',
                                    description: 'Maximize profit by choosing a single day to buy and one to sell.',
                                    difficulty: 'Easy',
                                    order: 2
                                },
                                {
                                    title: 'Product of Array Except Self',
                                    description: 'Calculate product of all elements except the one at current index.',
                                    difficulty: 'Medium',
                                    order: 3
                                }
                            ]
                        }
                    },
                    {
                        title: 'Strings',
                        order: 2,
                        problems: {
                            create: [
                                {
                                    title: 'Valid Anagram',
                                    difficulty: 'Easy',
                                    order: 1
                                },
                                {
                                    title: 'Longest Palindromic Substring',
                                    difficulty: 'Medium',
                                    order: 2
                                }
                            ]
                        }
                    }
                ]
            }
        }
    });

    // ===================================
    // 5. ROADMAPS
    // ===================================
    console.log('Creating Roadmaps...');

    await prisma.roadmap.create({
        data: {
            title: 'Full Stack Web Development (MERN)',
            description: 'Master the MERN stack (MongoDB, Express, React, Node.js) and build production-ready applications.',
            roleTarget: 'Full Stack Developer',
            phases: {
                create: [
                    {
                        title: 'Frontend Foundations',
                        order: 1,
                        level: 'Beginner',
                        duration: '4 Weeks',
                        description: 'Learn HTML, CSS, and Modern JavaScript.',
                        sections: {
                            create: [
                                {
                                    title: 'HTML & CSS',
                                    order: 1,
                                    items: {
                                        create: [
                                            { title: 'Semantic HTML', order: 1 },
                                            { title: 'Flexbox & Grid', order: 2 },
                                            { title: 'Responsive Design', order: 3 }
                                        ]
                                    }
                                },
                                {
                                    title: 'JavaScript',
                                    order: 2,
                                    items: {
                                        create: [
                                            { title: 'ES6+ Features', order: 1 },
                                            { title: 'DOM Manipulation', order: 2 },
                                            { title: 'Async/Await', order: 3 }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        title: 'React.js Mastery',
                        order: 2,
                        level: 'Intermediate',
                        duration: '6 Weeks',
                        description: 'Dive deep into React ecosystem.',
                        playlists: {
                            create: {
                                title: 'Official React Documentation',
                                url: 'https://react.dev',
                                videoCount: 0,
                                author: 'Meta'
                            }
                        }
                    }
                ]
            }
        }
    });

    console.log('✅ Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
