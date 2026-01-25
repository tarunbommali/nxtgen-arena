const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🔧 Fixing Database Collation to utf8mb4_0900_ai_ci...');

    try {
        // Convert tables to the collation that matches the server connection default (usually utf8mb4_0900_ai_ci for MySQL 8+)

        const tables = ['events', 'event_categories', 'users', 'event_registrations', 'teams'];

        for (const table of tables) {
            try {
                await prisma.$executeRawUnsafe(`ALTER TABLE ${table} CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`);
                console.log(`✅ Updated ${table} table collation.`);
            } catch (e) {
                console.log(`⚠️ Could not update ${table} (might not exist or different error):`, e.message);
            }
        }

        console.log('🎉 Collation fixed to match MySQL 8 default!');

    } catch (e) {
        console.error('❌ Failed to fix collation:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
