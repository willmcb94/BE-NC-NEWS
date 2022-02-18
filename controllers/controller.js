const { fetchTopics, fetchArticleById, sendArticleVote, fetchUsers, fetchArticlesSorted, addArticleComment, checkArticleExists, fetchArticleComments, removeCommentById } = require("../models/model");

exports.getTopics = async (req, res, next) => {
    try {
        const topics = await fetchTopics();
        res.status(200).send({ topics: topics })
    } catch (err) {
        next(err);
    }
}
exports.getUsers = async (req, res, next) => {
    try {
        const users = await fetchUsers();
        res.status(200).send({ users: users })
    } catch (err) {
        next(err);
    }
}
exports.getArticlesSorted = async (req, res, next) => {
    try {

        const articles = await fetchArticlesSorted(req.query.order, req.query.sort_by, req.query.topic);
        res.status(200).send({ articles: articles })
    } catch (err) {
        next(err);
    }
}
exports.getArticleById = async (req, res, next) => {
    try {
        const article = await fetchArticleById(req.params.article_id);
        res.status(200).send(article);
    } catch (err) {
        next(err);
    }
}

exports.updateArticleVotes = async (req, res, next) => {
    try {

        const updatedVotes = await sendArticleVote(req.params.article_id, req.body);

        res.status(200).send(updatedVotes);
    } catch (err) {

        next(err);
    }
}


exports.postComment = async (req, res, next) => {
    try {
        const comment = await addArticleComment(req.params.article_id, req.body);
        res.status(201).send({ comment: comment })
    } catch (err) {

        next(err);
    }
}

exports.getComments = async (req, res, next) => {
    try {
        const [comments] = await Promise.all([fetchArticleComments(req.params.article_id), checkArticleExists(req.params.article_id)])

        res.status(200).send({ comments: comments })
    } catch (err) {
        next(err)
    }
}

exports.deleteCommentById = async (req, res, next) => {
    try {
        await removeCommentById(req.params.comment_id)
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}