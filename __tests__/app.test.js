const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data")


beforeEach(() => seed(data));
afterAll(() => db.end())

describe('PATH NOT FOUND for all -  /api/*', () => {
    test('should respond 404 if path not found', () => {
        return request(app)
            .get("/api/not-a-route")
            .expect(404)
            .then((response) => {
                const message = { msg: "path not found" };
                expect(response.body).toEqual(message);
            })
    });

});

describe('/api/topics', () => {
    describe('HAPPY PATH GET /api/topics', () => {
        test('200 OK - Should return a 200 status code if succesful', () => {
            return request(app)
                .get("/api/topics")
                .expect(200)
        });
        test('200 OK - hould return an array with 1 or more objects in', () => {
            return request(app)
                .get("/api/topics")
                .expect(200)
                .then((response) => {
                    expect(response.body.topics).toBeInstanceOf(Array);
                    expect(response.body.topics.length).toBeGreaterThan(0);
                })
        });
        test('200 OK - Array returned should have objects with correct properties', () => {
            return request(app)
                .get("/api/topics")
                .expect(200)
                .then((response) => {
                    response.body.topics.forEach(topic => {
                        expect(topic).toEqual(expect.objectContaining({
                            description: expect.any(String),
                            slug: expect.any(String)
                        }))
                    })
                })
        });
    });


});
describe('/api/articles/:article_id', () => {
    describe('HAPPY PATH GET /api/articles/:article_id', () => {
        test('200 OK - Should return a 200 status code if succesful', () => {
            return request(app)
                .get("/api/articles/2")
                .expect(200)
        });
        test('200 OK - Should return a object', () => {
            return request(app)
                .get("/api/articles/2")
                .expect(200)
                .then((response) => {

                    expect(typeof response.body).toBe('object');
                    expect(Array.isArray(response)).toBe(false)
                })
        });
        test('200 OK - Array returned should have objects with correct properties', () => {
            return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then((response) => {
                    expect(response.body).toEqual(expect.objectContaining({
                        author: "butter_bridge",
                        title: "Living in the shadow of a great man",
                        article_id: 1,
                        body: "I find this existence challenging",
                        topic: "mitch",
                        created_at: new Date(1594329060000 - 3600000).toString(),
                        votes: 100
                    }))

                })
        });

    })

    describe('SAD PATH GET /api/articles/:article_id', () => {

        test('should respond 404 if path valid but not found', () => {
            return request(app)
                .get("/api/articles/100000000")
                .expect(404)
                .then((response) => {
                    const message = { msg: `No article found for article_id: 100000000` };
                    expect(response.body).toEqual(message);
                })
        });
        test('should respond 400 if bad request', () => {
            return request(app)
                .get("/api/articles/not-a-number")
                .expect(400)
                .then((response) => {
                    const message = { msg: "Bad request - not a ID number" };
                    expect(response.body).toEqual(message);
                })
        });

    });

    describe('HAPPY PATH PATCH /api/articles/:article_id', () => {
        const newVote = { inc_votes: 1 }
        const newVoteTwo = { inc_votes: -100 }
        test('200 OK - Should return a 200 status code if succesful', () => {
            return request(app)
                .patch("/api/articles/2")
                .send(newVote)
                .expect(200)
        });
        test('200 OK - Should return an object', () => {
            return request(app)
                .patch("/api/articles/2")
                .send(newVote)
                .expect(200)
                .then((response) => {
                    expect(typeof response.body).toBe('object');
                    expect(Array.isArray(response)).toBe(false)
                })
        });

        test('200 OK - Object should have following properties - including added votes', () => {
            return request(app)
                .patch("/api/articles/1")
                .send(newVote)
                .expect(200)
                .then((response) => {
                    expect(response.body).toEqual(expect.objectContaining({
                        author: "butter_bridge",
                        title: "Living in the shadow of a great man",
                        article_id: 1,
                        body: "I find this existence challenging",
                        topic: "mitch",
                        created_at: expect.any(String),
                        votes: 101
                    }))

                })
        });
        test('200 OK - Object should have following properties - including minus votes', () => {
            return request(app)
                .patch("/api/articles/1")
                .send(newVoteTwo)
                .expect(200)
                .then((response) => {
                    expect(response.body).toEqual(expect.objectContaining({
                        author: "butter_bridge",
                        title: "Living in the shadow of a great man",
                        article_id: 1,
                        body: "I find this existence challenging",
                        topic: "mitch",
                        created_at: expect.any(String),
                        votes: 0
                    }))

                })
        });

    });

    describe('SAD PATH PATCH', () => {
        const newVote = { inc_votes: 1 }

        test('should respond 404 if path valid but not found', () => {
            return request(app)
                .patch("/api/articles/100000000")
                .expect(404)
                .send(newVote)
                .then((response) => {
                    const message = { msg: `No article found for article_id: 100000000` };
                    expect(response.body).toEqual(message);
                })
        });
        test('should respond 400 if bad request', () => {
            return request(app)
                .patch("/api/articles/not-a-number")
                .send(newVote)
                .expect(400)
                .then((response) => {
                    const message = { msg: "Bad request - not a ID number" };
                    expect(response.body).toEqual(message);
                })
        });
        test('should return bad request if body is empty', () => {
            return request(app)
                .patch('/api/articles/2')
                .send({})
                .expect(400)
                .then((response) => {
                    const message = { msg: "No body submitted" }
                    expect(response.body).toEqual(message)
                })

        });
        test('should return bad request if body value has incorrect data type', () => {
            return request(app)
                .patch('/api/articles/2')
                .send({ inc_votes: 'word' })
                .expect(400)
                .then((response) => {
                    const message = { msg: "Incorrect data in body - must be int" }
                    expect(response.body).toEqual(message)
                })

        });
        test('should return bad request if body key is incorrect', () => {
            return request(app)
                .patch('/api/articles/2')
                .send({ inc_votess: 2 })
                .expect(400)
                .then((response) => {
                    const message = { msg: "The body key submitted is incorrect" }
                    expect(response.body).toEqual(message)
                })

        });

    });
});


