const { pool } = require('../config/db');

const createTables = async () => {
    try {
        // Users table
        const usersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('student', 'admin') DEFAULT 'student',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Events table (replaces contests)
        const eventsTable = `
            CREATE TABLE IF NOT EXISTS events (
                id VARCHAR(100) PRIMARY KEY,
                name VARCHAR(500) NOT NULL,
                type ENUM('challenge', 'hackathon', 'coding_contest', 'workshop', 'ctf') NOT NULL,
                status ENUM('active', 'upcoming', 'completed') DEFAULT 'upcoming',
                description TEXT,
                tags JSON,
                location VARCHAR(255),
                registration_deadline DATETIME,
                event_start_date DATETIME NOT NULL,
                event_end_date DATETIME NOT NULL,
                total_participants INT DEFAULT 0,
                prizes JSON,
                organizer VARCHAR(255),
                difficulty ENUM('beginner', 'intermediate', 'advanced', 'all-levels') DEFAULT 'all-levels',
                has_roadmap BOOLEAN DEFAULT FALSE,
                roadmap_id VARCHAR(100),
                registration_status ENUM('not_open', 'open', 'closed') DEFAULT 'not_open',
                problem_count INT DEFAULT 0,
                rounds JSON,
                tracks JSON,
                schedule JSON,
                created_by INT,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Roadmaps table
        const roadmapsTable = `
            CREATE TABLE IF NOT EXISTS roadmaps (
                id VARCHAR(100) PRIMARY KEY,
                name VARCHAR(500) NOT NULL,
                total_duration_months INT NOT NULL,
                levels JSON NOT NULL,
                capstone_projects JSON,
                career_outcomes JSON,
                created_by INT,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // DSA Problems table
        const dsaProblemsTable = `
            CREATE TABLE IF NOT EXISTS dsa_problems (
                id VARCHAR(100) PRIMARY KEY,
                category_id VARCHAR(100) NOT NULL,
                category_name VARCHAR(255) NOT NULL,
                title VARCHAR(500) NOT NULL,
                difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
                tags JSON,
                description TEXT,
                concept TEXT,
                approaches JSON,
                key_insights JSON,
                created_by INT,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Event Registrations table
        const eventRegistrationsTable = `
            CREATE TABLE IF NOT EXISTS event_registrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                event_id VARCHAR(100) NOT NULL,
                registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
                UNIQUE(user_id, event_id)
            );
        `;

        // User Progress table (for roadmaps)
        const userProgressTable = `
            CREATE TABLE IF NOT EXISTS user_progress (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                roadmap_id VARCHAR(100) NOT NULL,
                completed_items JSON DEFAULT '[]',
                progress_percentage DECIMAL(5,2) DEFAULT 0.00,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE,
                UNIQUE(user_id, roadmap_id)
            );
        `;

        // DSA Progress table
        const dsaProgressTable = `
            CREATE TABLE IF NOT EXISTS dsa_progress (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                problem_id VARCHAR(100) NOT NULL,
                is_solved BOOLEAN DEFAULT FALSE,
                solved_at TIMESTAMP NULL,
                notes TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (problem_id) REFERENCES dsa_problems(id) ON DELETE CASCADE,
                UNIQUE(user_id, problem_id)
            );
        `;

        // Submissions table
        const submissionsTable = `
            CREATE TABLE IF NOT EXISTS submissions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                event_id VARCHAR(100),
                problem_id VARCHAR(255),
                code_content TEXT,
                submission_type ENUM('code', 'link', 'file') DEFAULT 'code',
                language VARCHAR(50),
                status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
            );
        `;

        // Create all tables
        await pool.query(usersTable);
        console.log('✅ Users table ready');

        await pool.query(eventsTable);
        console.log('✅ Events table ready');

        await pool.query(roadmapsTable);
        console.log('✅ Roadmaps table ready');

        await pool.query(dsaProblemsTable);
        console.log('✅ DSA Problems table ready');

        await pool.query(eventRegistrationsTable);
        console.log('✅ Event Registrations table ready');

        await pool.query(userProgressTable);
        console.log('✅ User Progress table ready');

        await pool.query(dsaProgressTable);
        console.log('✅ DSA Progress table ready');

        await pool.query(submissionsTable);
        console.log('✅ Submissions table ready');

        console.log('🎉 All Tables Created Successfully');
    } catch (error) {
        console.error('❌ Error creating tables:', error);
    }
};

module.exports = createTables;
