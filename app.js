const express = require('express');
const app = express();
const { getTopics, getArticleById } = require('./controllers/controller');
const { handlePsqlErrors, handleCustoms, handle500s } = require('./errors')
app.use(express.json());



app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)


app.all("/*", (req, res, next) => {
    res.status(404).send({ msg: "path not found" });
})

app.use(handlePsqlErrors)
app.use(handleCustoms)
app.use(handle500s)

module.exports = app;