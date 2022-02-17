
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
    const { rows } = await db.query('SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM comments LEFT JOIN articles ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;');


    return rows
}

exports.fetchArticleById = async (id) => {

    const { rows } = await db.query(`SELECT articles. *,
    CAST(COUNT(comments.article_id) AS INT) AS comment_count
    FROM comments right JOIN articles ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [id])


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


exports.checkArticleExists = async (id) => {

    const { rows } = await db.query(`
    SELECT * FROM articles
    WHERE article_id = $1;`,
        [id]
    )

    if (rows.length === 0) {

        return Promise.reject({
            status: 404,
            msg: `No article found for article_id: ${id}`,
        });
    }
}

exports.addArticleComment = async (id, body) => {

    await this.checkArticleExists(id)

    if (body === undefined || Object.keys(body).length === 0) {

        return Promise.reject({
            status: 400,
            msg: `Empty input submitted`,
        });

    } else if (Object.keys(body)[0] !== 'username' || Object.keys(body)[1] !== 'body') {
        return Promise.reject({
            status: 400,
            msg: `incorrect key submitted, should be username & body`,
        });
    } else if (typeof body.username !== 'string') {
        return Promise.reject({
            status: 400,
            msg: `Username must be a string`,
        });
    } else if (typeof body.body !== 'string') {
        return Promise.reject({
            status: 400,
            msg: `Body must be a string`,
        });
    } else {
        const { rows } = await db.query(`
    INSERT INTO comments
    (author, body, article_id, votes)
    VALUES ($1, $2, $3, $4)
     RETURNING*;`, [body.username, body.body, id, 0])



        return rows[0]
    }
}

exports.fetchArticleComments = async (id) => {

    await this.checkArticleExists(id)

    const { rows } = await db.query(`SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1`, [id])

    return rows

}

