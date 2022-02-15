
const db = require('../db/connection')

exports.fetchTopics = async () => {
    const { rows } = await db.query('SELECT * FROM topics');
    return rows
}

exports.fetchUsers = async () => {
    const { rows } = await db.query('SELECT * FROM users');
    return rows
}

exports.fetchArticlesSorted = async () => {
    const { rows } = await db.query('SELECT * FROM Articles ORDER BY created_at DESC;');
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

exports.sendArticleVote = async (id, body) => {


    if (body === undefined || Object.keys(body).length === 0) {

        return Promise.reject({
            status: 400,
            msg: `No body submitted`,
        });

    } else if (Object.keys(body)[0] !== 'inc_votes' && Object.keys(body)[0] !== undefined) {

        return Promise.reject({
            status: 400,
            msg: `The body key submitted is incorrect`,
        });

    } else if (typeof body.inc_votes !== 'number' && typeof body.inc_votes !== undefined) {

        return Promise.reject({
            status: 400,
            msg: `Incorrect data in body - must be int`,
        });
    }

    else {

        const voteToAdd = body.inc_votes
        const { rows } = await db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING*;', [voteToAdd, id])

        if (rows[0] === undefined) {

            return Promise.reject({
                status: 404,
                msg: `No article found for article_id: ${id}`,
            });
        } else {

            return rows[0]
        }

    }
}