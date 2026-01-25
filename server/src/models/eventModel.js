const { pool } = require('../config/db');

class Event {
    static async create(eventData) {
        const query = `
            INSERT INTO events (
                id, name, type, status, description, tags, location,
                registration_deadline, event_start_date, event_end_date,
                total_participants, prizes, organizer, difficulty,
                has_roadmap, roadmap_id, registration_status, problem_count,
                rounds, tracks, schedule, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            eventData.id,
            eventData.name,
            eventData.type,
            eventData.status || 'upcoming',
            eventData.description,
            JSON.stringify(eventData.tags || []),
            eventData.location,
            eventData.registrationDeadline,
            eventData.eventStartDate,
            eventData.eventEndDate,
            eventData.totalParticipants || 0,
            JSON.stringify(eventData.prizes || []),
            eventData.organizer,
            eventData.difficulty || 'all-levels',
            eventData.hasRoadmap || false,
            eventData.roadmapId || null,
            eventData.registrationStatus || 'not_open',
            eventData.problemCount || 0,
            JSON.stringify(eventData.rounds || []),
            JSON.stringify(eventData.tracks || []),
            JSON.stringify(eventData.schedule || []),
            eventData.createdBy || null
        ];

        const [result] = await pool.execute(query, values);
        return result.insertId;
    }

    static async findAll() {
        const query = 'SELECT * FROM events ORDER BY event_start_date DESC';
        const [rows] = await pool.execute(query);
        return rows.map(row => ({
            ...row,
            tags: JSON.parse(row.tags || '[]'),
            prizes: JSON.parse(row.prizes || '[]'),
            rounds: JSON.parse(row.rounds || '[]'),
            tracks: JSON.parse(row.tracks || '[]'),
            schedule: JSON.parse(row.schedule || '[]')
        }));
    }

    static async findById(id) {
        const query = 'SELECT * FROM events WHERE id = ?';
        const [rows] = await pool.execute(query, [id]);
        if (rows.length === 0) return null;

        const event = rows[0];
        return {
            ...event,
            tags: JSON.parse(event.tags || '[]'),
            prizes: JSON.parse(event.prizes || '[]'),
            rounds: JSON.parse(event.rounds || '[]'),
            tracks: JSON.parse(event.tracks || '[]'),
            schedule: JSON.parse(event.schedule || '[]')
        };
    }

    static async update(id, eventData) {
        const updates = [];
        const values = [];

        Object.keys(eventData).forEach(key => {
            if (key !== 'id' && eventData[key] !== undefined) {
                updates.push(`${key} = ?`);
                // Convert arrays/objects to JSON strings
                if (Array.isArray(eventData[key]) || typeof eventData[key] === 'object') {
                    values.push(JSON.stringify(eventData[key]));
                } else {
                    values.push(eventData[key]);
                }
            }
        });

        values.push(id);
        const query = `UPDATE events SET ${updates.join(', ')} WHERE id = ?`;
        const [result] = await pool.execute(query, values);
        return result.affectedRows;
    }

    static async delete(id) {
        const query = 'DELETE FROM events WHERE id = ?';
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows;
    }

    static async findByStatus(status) {
        const query = 'SELECT * FROM events WHERE status = ? ORDER BY event_start_date DESC';
        const [rows] = await pool.execute(query, [status]);
        return rows.map(row => ({
            ...row,
            tags: JSON.parse(row.tags || '[]'),
            prizes: JSON.parse(row.prizes || '[]'),
            rounds: JSON.parse(row.rounds || '[]'),
            tracks: JSON.parse(row.tracks || '[]'),
            schedule: JSON.parse(row.schedule || '[]')
        }));
    }
}

module.exports = Event;
