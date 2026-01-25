const { pool } = require('../config/db');

class UserProgress {
    // Roadmap Progress
    static async saveRoadmapProgress(userId, roadmapId, completedItems) {
        const totalItems = completedItems.length; // You may want to calculate this differently
        const progressPercentage = totalItems > 0 ? (completedItems.filter(Boolean).length / totalItems) * 100 : 0;

        const query = `
            INSERT INTO user_progress (user_id, roadmap_id, completed_items, progress_percentage)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                completed_items = VALUES(completed_items),
                progress_percentage = VALUES(progress_percentage)
        `;

        const [result] = await pool.execute(query, [
            userId,
            roadmapId,
            JSON.stringify(completedItems),
            progressPercentage
        ]);
        return result.affectedRows;
    }

    static async getRoadmapProgress(userId, roadmapId) {
        const query = 'SELECT * FROM user_progress WHERE user_id = ? AND roadmap_id = ?';
        const [rows] = await pool.execute(query, [userId, roadmapId]);
        if (rows.length === 0) return null;

        return {
            ...rows[0],
            completed_items: JSON.parse(rows[0].completed_items || '[]')
        };
    }

    static async getAllUserRoadmapProgress(userId) {
        const query = 'SELECT * FROM user_progress WHERE user_id = ?';
        const [rows] = await pool.execute(query, [userId]);
        return rows.map(row => ({
            ...row,
            completed_items: JSON.parse(row.completed_items || '[]')
        }));
    }

    // DSA Progress
    static async toggleProblemSolved(userId, problemId, isSolved) {
        const query = `
            INSERT INTO dsa_progress (user_id, problem_id, is_solved, solved_at)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                is_solved = VALUES(is_solved),
                solved_at = VALUES(solved_at)
        `;

        const solvedAt = isSolved ? new Date() : null;
        const [result] = await pool.execute(query, [userId, problemId, isSolved, solvedAt]);
        return result.affectedRows;
    }

    static async getDSAProgress(userId) {
        const query = 'SELECT * FROM dsa_progress WHERE user_id = ? AND is_solved = TRUE';
        const [rows] = await pool.execute(query, [userId]);
        return rows;
    }

    static async getDSAStats(userId) {
        const query = `
            SELECT 
                COUNT(*) as total_solved,
                SUM(CASE WHEN p.difficulty = 'easy' THEN 1 ELSE 0 END) as easy_solved,
                SUM(CASE WHEN p.difficulty = 'medium' THEN 1 ELSE 0 END) as medium_solved,
                SUM(CASE WHEN p.difficulty = 'hard' THEN 1 ELSE 0 END) as hard_solved
            FROM dsa_progress dp
            JOIN dsa_problems p ON dp.problem_id = p.id
            WHERE dp.user_id = ? AND dp.is_solved = TRUE
        `;
        const [rows] = await pool.execute(query, [userId]);
        return rows[0];
    }

    // Event Registration
    static async registerForEvent(userId, eventId) {
        const query = `
            INSERT INTO event_registrations (user_id, event_id)
            VALUES (?, ?)
        `;

        try {
            const [result] = await pool.execute(query, [userId, eventId]);
            // Increment participant count
            await pool.execute('UPDATE events SET total_participants = total_participants + 1 WHERE id = ?', [eventId]);
            return result.insertId;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Already registered for this event');
            }
            throw error;
        }
    }

    static async getUserEvents(userId) {
        const query = `
            SELECT e.* FROM events e
            JOIN event_registrations er ON e.id = er.event_id
            WHERE er.user_id = ?
            ORDER BY e.event_start_date DESC
        `;
        const [rows] = await pool.execute(query, [userId]);
        return rows.map(row => ({
            ...row,
            tags: JSON.parse(row.tags || '[]'),
            prizes: JSON.parse(row.prizes || '[]'),
            rounds: JSON.parse(row.rounds || '[]'),
            tracks: JSON.parse(row.tracks || '[]'),
            schedule: JSON.parse(row.schedule || '[]')
        }));
    }

    static async isRegisteredForEvent(userId, eventId) {
        const query = 'SELECT * FROM event_registrations WHERE user_id = ? AND event_id = ?';
        const [rows] = await pool.execute(query, [userId, eventId]);
        return rows.length > 0;
    }
}

module.exports = UserProgress;
