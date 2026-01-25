const { pool } = require('../config/db');
const Event = require('../models/eventModel');
const Roadmap = require('../models/roadmapModel');
const DSAProblem = require('../models/dsaProblemModel');

// Import JSON data
const eventsData = require('../../../src/data/events.json');
const roadmapsData = require('../../../src/data/roadmaps.json');
const dsaData = require('../../../src/data/dsaSheet.json');

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Seed Events
        console.log('📅 Seeding events...');
        for (const event of eventsData) {
            try {
                await Event.create({
                    id: event.id,
                    name: event.name,
                    type: event.type,
                    status: event.status,
                    description: event.description,
                    tags: event.tags,
                    location: event.location,
                    registrationDeadline: event.registrationDeadline,
                    eventStartDate: event.eventStartDate,
                    eventEndDate: event.eventEndDate,
                    totalParticipants: event.totalParticipants,
                    prizes: event.prizes,
                    organizer: event.organizer,
                    difficulty: event.difficulty,
                    hasRoadmap: event.hasRoadmap,
                    roadmapId: event.roadmapId,
                    registrationStatus: event.registrationStatus,
                    problemCount: event.problemCount,
                    rounds: event.rounds,
                    tracks: event.tracks || [],
                    schedule: event.schedule || []
                });
                console.log(`  ✓ Created event: ${event.name}`);
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    console.log(`  - Event already exists: ${event.name}`);
                } else {
                    console.error(`  ✗ Error creating event ${event.name}:`, error.message);
                }
            }
        }

        // Seed Roadmaps
        console.log('\n🗺️  Seeding roadmaps...');
        for (const roadmap of roadmapsData) {
            try {
                await Roadmap.create(roadmap);
                console.log(`  ✓ Created roadmap: ${roadmap.roadmapName}`);
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    console.log(`  - Roadmap already exists: ${roadmap.roadmapName}`);
                } else {
                    console.error(`  ✗ Error creating roadmap ${roadmap.roadmapName}:`, error.message);
                }
            }
        }

        // Seed DSA Problems
        console.log('\n💻 Seeding DSA problems...');
        for (const category of dsaData.categories) {
            console.log(`  Category: ${category.name}`);
            for (const problem of category.problems) {
                try {
                    await DSAProblem.create({
                        id: problem.id,
                        categoryId: category.id,
                        categoryName: category.name,
                        title: problem.title,
                        difficulty: problem.difficulty,
                        tags: problem.tags,
                        description: problem.description,
                        concept: problem.concept,
                        approaches: problem.approaches,
                        keyInsights: problem.keyInsights
                    });
                    console.log(`    ✓ Created problem: ${problem.title}`);
                } catch (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        console.log(`    - Problem already exists: ${problem.title}`);
                    } else {
                        console.error(`    ✗ Error creating problem ${problem.title}:`, error.message);
                    }
                }
            }
        }

        console.log('\n🎉 Database seeding completed!');
        console.log(`\nSummary:`);
        console.log(`  - Events: ${eventsData.length}`);
        console.log(`  - Roadmaps: ${roadmapsData.length}`);
        console.log(`  - DSA Problems: ${dsaData.statistics.totalProblems}`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await pool.end();
        process.exit();
    }
};

// Run seeding
seedDatabase();
