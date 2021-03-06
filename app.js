const express = require('express');
const app = express();
const { getTopics, getArticleById, updateArticleVotes, getUsers, getArticlesSorted, postComment, getComments, deleteCommentById, getEndpoints } = require('./controllers/controller');
const { handlePsqlErrors, handleCustoms, handle500s } = require('./errors')
app.use(express.json());
const cors = require('cors');

app.use(cors())
app.get('/api/topics', getTopics)
app.get('/api/users', getUsers)
app.get('/api/articles', getArticlesSorted)
app.get('/api/articles/:article_id', getArticleById)
app.patch('/api/articles/:article_id', updateArticleVotes)
app.post('/api/articles/:article_id/comments', postComment)
app.get('/api/articles/:article_id/comments', getComments)
app.delete('/api/comments/:comment_id', deleteCommentById)
app.get('/api', getEndpoints)




app.all("/*", (req, res, next) => {
    res.status(404).send({ msg: "path not found" });
})

app.use(handlePsqlErrors)
app.use(handleCustoms)
app.use(handle500s)

module.exports = app;
