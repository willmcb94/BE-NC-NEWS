
const db = require('../db/connection')

exports.fetchTopics = async () => {
    const { rows } = await db.query('SELECT * FROM topics');
    return rows
}

exports.fetchArticle = async (id) => {
    const { rows } = await db.query('SELECT * FROM articles WHERE article_id = $1;', [id])
    rows[0].created_at = rows[0].created_at.toString()
    return rows[0]

}