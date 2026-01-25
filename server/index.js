const dotenv = require('dotenv');
const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const createTables = require('./src/utils/dbInit');

dotenv.config({ quiet: true });

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // First, connect to database
        await connectDB();

        // Then, create tables
        await createTables();

        // Finally, start the server only if database is ready
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
