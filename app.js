const express = require('express');
const app = express();
const { getTopics, getArticle } = require('./controllers/controller');
app.use(express.json());



app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticle)




app.all("/*", (req, res, next) => {

    res.status(404).send({ msg: "path not found" });
})

app.all("/*", (req, res, next) => {

    res.status(404).send({ msg: "path not found" });
})

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad request - not a ID number' });
    } else {
        res.status(500).send('Server Error!');
    }
});

module.exports = app;

