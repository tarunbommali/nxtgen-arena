const { pool } = require('../config/db');

class DSAProblem {
    static async create(problemData) {
        const query = `
            INSERT INTO dsa_problems (
                id, category_id, category_name, title, difficulty,
                tags, description, concept, approaches, key_insights, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            problemData.id,
            problemData.categoryId,
            problemData.categoryName,
            problemData.title,
            problemData.difficulty,
            JSON.stringify(problemData.tags || []),
            problemData.description,
            problemData.concept,
            JSON.stringify(problemData.approaches || []),
            JSON.stringify(problemData.keyInsights || []),
            problemData.createdBy || null
        ];

        const [result] = await pool.execute(query, values);
        return result.insertId;
    }

    static async findAll() {
        const query = 'SELECT * FROM dsa_problems ORDER BY category_id, difficulty';
        const [rows] = await pool.execute(query);
        return rows.map(row => ({
            id: row.id,
            categoryId: row.category_id,
            categoryName: row.category_name,
            title: row.title,
            difficulty: row.difficulty,
            tags: JSON.parse(row.tags || '[]'),
            description: row.description,
            concept: row.concept,
            approaches: JSON.parse(row.approaches || '[]'),
            keyInsights: JSON.parse(row.key_insights || '[]')
        }));
    }

    static async findByCategory(categoryId) {
        const query = 'SELECT * FROM dsa_problems WHERE category_id = ? ORDER BY difficulty';
        const [rows] = await pool.execute(query, [categoryId]);
        return rows.map(row => ({
            id: row.id,
            categoryId: row.category_id,
            categoryName: row.category_name,
            title: row.title,
            difficulty: row.difficulty,
            tags: JSON.parse(row.tags || '[]'),
            description: row.description,
            concept: row.concept,
            approaches: JSON.parse(row.approaches || '[]'),
            keyInsights: JSON.parse(row.key_insights || '[]')
        }));
    }

    static async findById(id) {
        const query = 'SELECT * FROM dsa_problems WHERE id = ?';
        const [rows] = await pool.execute(query, [id]);
        if (rows.length === 0) return null;

        const problem = rows[0];
        return {
            id: problem.id,
            categoryId: problem.category_id,
            categoryName: problem.category_name,
            title: problem.title,
            difficulty: problem.difficulty,
            tags: JSON.parse(problem.tags || '[]'),
            description: problem.description,
            concept: problem.concept,
            approaches: JSON.parse(problem.approaches || '[]'),
            keyInsights: JSON.parse(problem.key_insights || '[]')
        };
    }

    static async update(id, problemData) {
        const query = `
            UPDATE dsa_problems 
            SET category_id = ?, category_name = ?, title = ?, difficulty = ?,
                tags = ?, description = ?, concept = ?, approaches = ?, key_insights = ?
            WHERE id = ?
        `;

        const values = [
            problemData.categoryId,
            problemData.categoryName,
            problemData.title,
            problemData.difficulty,
            JSON.stringify(problemData.tags || []),
            problemData.description,
            problemData.concept,
            JSON.stringify(problemData.approaches || []),
            JSON.stringify(problemData.keyInsights || []),
            id
        ];

        const [result] = await pool.execute(query, values);
        return result.affectedRows;
    }

    static async delete(id) {
        const query = 'DELETE FROM dsa_problems WHERE id = ?';
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows;
    }
}

module.exports = DSAProblem;
