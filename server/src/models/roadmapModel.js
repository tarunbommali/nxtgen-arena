const { pool } = require('../config/db');

class Roadmap {
    static async create(roadmapData) {
        const query = `
            INSERT INTO roadmaps (
                id, name, total_duration_months, levels,
                capstone_projects, career_outcomes, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            roadmapData.id,
            roadmapData.roadmapName,
            roadmapData.totalDurationMonths,
            JSON.stringify(roadmapData.levels),
            JSON.stringify(roadmapData.capstoneProjects || []),
            JSON.stringify(roadmapData.careerOutcome || []),
            roadmapData.createdBy || null
        ];

        const [result] = await pool.execute(query, values);
        return result.insertId;
    }

    static async findAll() {
        const query = 'SELECT * FROM roadmaps ORDER BY created_at DESC';
        const [rows] = await pool.execute(query);
        return rows.map(row => ({
            id: row.id,
            roadmapName: row.name,
            totalDurationMonths: row.total_duration_months,
            levels: JSON.parse(row.levels),
            capstoneProjects: JSON.parse(row.capstone_projects || '[]'),
            careerOutcome: JSON.parse(row.career_outcomes || '[]'),
            createdAt: row.created_at
        }));
    }

    static async findById(id) {
        const query = 'SELECT * FROM roadmaps WHERE id = ?';
        const [rows] = await pool.execute(query, [id]);
        if (rows.length === 0) return null;

        const roadmap = rows[0];
        return {
            id: roadmap.id,
            roadmapName: roadmap.name,
            totalDurationMonths: roadmap.total_duration_months,
            levels: JSON.parse(roadmap.levels),
            capstoneProjects: JSON.parse(roadmap.capstone_projects || '[]'),
            careerOutcome: JSON.parse(roadmap.career_outcomes || '[]'),
            createdAt: roadmap.created_at
        };
    }

    static async update(id, roadmapData) {
        const query = `
            UPDATE roadmaps 
            SET name = ?, total_duration_months = ?, levels = ?,
                capstone_projects = ?, career_outcomes = ?
            WHERE id = ?
        `;

        const values = [
            roadmapData.roadmapName,
            roadmapData.totalDurationMonths,
            JSON.stringify(roadmapData.levels),
            JSON.stringify(roadmapData.capstoneProjects || []),
            JSON.stringify(roadmapData.careerOutcome || []),
            id
        ];

        const [result] = await pool.execute(query, values);
        return result.affectedRows;
    }

    static async delete(id) {
        const query = 'DELETE FROM roadmaps WHERE id = ?';
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows;
    }
}

module.exports = Roadmap;
