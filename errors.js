exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad request - not a ID number' });
    } else {
        next(err);
    }
}

exports.handleCustoms = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err)
    }
}

exports.handle500s = (err, req, res, next) => {
    res.status(500).send('Server Error!');
}