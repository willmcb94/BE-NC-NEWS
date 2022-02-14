const { fetchTopics } = require("../models/model");

// exports.getTopics = async (req, res, next) => {
//     const topics = await fetchTopics();
//     res.status(200).send({ topics: topics })

//         .catch((err) => {
//             next(err);
//         })
// }

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({ topics: topics })
    })
        .catch((err) => {
            console.log(err)
            next(err);
        })
}