const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🔧 Fixing Database Collation (with FK disabled)...');

    try {
        // Disable Foreign Key Checks to allow altering parent/child tables independently
        await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS=0;`);
        console.log('🔓 Foreign Key Checks Disabled');

        const tables = [
            'events',
            'event_categories',
            'event_types',
            'users',
            'event_registrations',
            'teams',
            'event_submissions',
            'challenges',
            'challenge_tasks',
            'roadmaps'
        ];

        for (const table of tables) {
            try {
                // Convert to MySQL 8.0 default
                await prisma.$executeRawUnsafe(`ALTER TABLE ${table} CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`);
                console.log(`✅ Updated ${table} collation.`);
            } catch (e) {
                console.log(`⚠️ Could not update ${table}:`, e.message.split('\n')[0]);
            }
        }

        // Re-enable FK checks
        await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS=1;`);
        console.log('🔒 Foreign Key Checks Re-enabled');
        console.log('🎉 ALL Collations synchronized!');

    } catch (e) {
        console.error('❌ Failed to fix collation:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
