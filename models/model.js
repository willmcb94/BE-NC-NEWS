
const db = require('../db/connection')

exports.fetchTopics = async () => {
    const { rows } = await db.query('SELECT * FROM topics');
    return rows
}

exports.fetchArticleById = async (id) => {
    const { rows } = await db.query('SELECT * FROM articles WHERE article_id = $1;', [id])


    if (rows[0] === undefined) {

        return Promise.reject({
            status: 404,
            msg: `No article found for article_id: ${id}`,
        });
    } else {
        rows[0].created_at = rows[0].created_at.toString()
        return rows[0]
    }

}