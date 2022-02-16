const { fetchTopics, fetchArticleById, sendArticleVote, fetchUsers, fetchArticlesSorted } = require("../models/model");

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
        const articles = await fetchArticlesSorted();
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

