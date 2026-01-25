const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🔧 Fixing Database Collation...');

    try {
        // 1. Check current collation (Optional, just force update)

        // 2. Update 'events' table
        await prisma.$executeRawUnsafe(`ALTER TABLE events CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        console.log('✅ Updated events table collation.');

        // 3. Update 'event_categories' table (related)
        await prisma.$executeRawUnsafe(`ALTER TABLE event_categories CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        console.log('✅ Updated event_categories table collation.');

        console.log('🎉 Collation mix fixed successfully!');

    } catch (e) {
        console.error('❌ Failed to fix collation:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
