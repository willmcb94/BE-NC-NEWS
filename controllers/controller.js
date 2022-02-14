const { fetchTopics, fetchArticle } = require("../models/model");

exports.getTopics = async (req, res, next) => {
    try {
        const topics = await fetchTopics();
        res.status(200).send({ topics: topics })
    } catch (err) {
        next(err);
    }
}

exports.getArticle = async (req, res, next) => {
    try {
        const article = await fetchArticle(req.params.article_id);
        res.status(200).send(article)
    } catch (err) {
        next(err);
    }
}

