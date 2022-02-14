const express = require('express');
const app = express();
const { getTopics } = require('./controllers/controller');
app.use(express.json());



app.get('/api/topics', getTopics)




app.all("/*", (req, res, next) => {

    res.status(404).send({ msg: "path not found" });
})

app.use((err, req, res, next) => {

    res.status(500).send('Server Error!');
});

module.exports = app;

