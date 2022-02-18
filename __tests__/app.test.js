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
                        votes: 100,
                        comment_count: expect.any(Number)

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
                        votes: 101,

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
                        votes: 0,


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


describe('/api/users', () => {
    describe('HAPPY PATH GET /api/users', () => {
        test('200 OK - Should return a 200 status code if succesful', () => {
            return request(app)
                .get("/api/users")
                .expect(200)
        });
        test('200 OK - should return an array with 1 or more objects in', () => {
            return request(app)
                .get("/api/users")
                .expect(200)
                .then((response) => {
                    expect(response.body.users).toBeInstanceOf(Array);
                    expect(response.body.users.length).toBeGreaterThan(0);
                })
        });
        test('200 OK - Array returned should have objects with correct properties', () => {
            return request(app)
                .get("/api/users")
                .expect(200)
                .then((response) => {
                    response.body.users.forEach(user => {
                        expect(user).toEqual(expect.objectContaining({
                            username: expect.any(String),

                        }))
                    })
                })
        });
    });
});

describe('/api/articles', () => {
    describe('HAPPY PATH GET /api/articles', () => {
        test('200 OK - Should return an array of objects with correct data', () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then((response) => {

                    expect(response.body.articles).toBeInstanceOf(Array);
                    expect(response.body.articles.length).toBeGreaterThan(0);
                    response.body.articles.forEach(article => {
                        expect(article).toEqual(expect.objectContaining({
                            author: expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            body: expect.any(String),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(Number)

                        }))
                    })
                });
        })
        test('200 OK - should return array sorted by date created if no query input', () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then((response) => {
                    expect(response.body.articles).toBeSortedBy('created_at', {
                        descending: true,
                    });
                })
        });
        test('200 OK - should return array sorted by inputted query, ordered by default DESC', () => {
            return request(app)
                .get("/api/articles?sort_by=comment_count")
                .expect(200)
                .then((response) => {
                    expect(response.body.articles).toBeSortedBy('comment_count', {
                        descending: true,
                    });
                })
        });
        test('200 OK - should return array ordered by asc if inputted', () => {
            return request(app)
                .get("/api/articles?order=asc")
                .expect(200)
                .then((response) => {
                    expect(response.body.articles).toBeSortedBy('created_at');
                })
        });
        test('200 OK - should return array sorted and ordered by correct input', () => {
            return request(app)
                .get("/api/articles?sort_by=votes&order=asc")
                .expect(200)
                .then((response) => {
                    expect(response.body.articles).toBeSortedBy('votes');
                })
        });
        test('200 OK - should return array filterd down by topic', () => {
            return request(app)
                .get("/api/articles?topic=cats")
                .expect(200)
                .then((response) => {
                    response.body.articles.forEach(article => {
                        expect(article).toEqual(expect.objectContaining({
                            author: expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            body: expect.any(String),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(Number)

                        }))
                    })
                })
        });
    })
    describe('SAD PATH /api/articles  ', () => {
        describe('SAD PATH queries /api/articles ', () => {
            test('Should be 400 bad request for invalid sort by', () => {
                return request(app)
                    .get("/api/articles?sort_by=invalid-input")
                    .expect(400)
                    .then((response) => {
                        const message = { msg: "Bad request - invalid query" };
                        expect(response.body).toEqual(message);
                    })
            });
            test('Should be 400 bad request for invalid order by', () => {
                return request(app)
                    .get("/api/articles?order=invalid")
                    .expect(400)
                    .then((response) => {
                        const message = { msg: "Bad request - invalid order by, please use asc or desc" };
                        expect(response.body).toEqual(message);
                    })
            });
            test('Should be 400 bad request for invalid topic', () => {
                return request(app)
                    .get("/api/articles?topic=invalid")
                    .expect(400)
                    .then((response) => {
                        const message = { msg: "Bad request - invalid topic" };
                        expect(response.body).toEqual(message);
                    })
            });
        });
    });

})


describe('/api/articles/:article_id/comments', () => {
    const newComment = {
        username: 'butter_bridge',
        body: 'my comment'
    }
    describe('HAPPY PATH POST /api/articles/:article_id/comments', () => {
        test('201 CREATED - Should add comment inputted with correct properties/values & return it', () => {

            return request(app)
                .post('/api/articles/1/comments')
                .send(newComment)
                .expect(201)
                .then((response) => {
                    expect(response.body.comment).toEqual(expect.objectContaining({
                        article_id: 1,
                        author: 'butter_bridge',
                        body: 'my comment',
                        votes: 0,
                        created_at: expect.any(String),
                        comment_id: expect.any(Number)
                    }))

                })
        });
    });
    describe('SAD PATH POST /api/articles/:article_id/comments', () => {
        test('should respond 400 if bad request on ID', () => {
            return request(app)
                .post('/api/articles/not-a-number/comments')
                .send(newComment)
                .expect(400)
                .then((response) => {
                    const message = { msg: "Bad request - not a ID number" };
                    expect(response.body).toEqual(message);
                })
        });
        test('should respond 404 if path valid but not found', () => {
            return request(app)
                .post("/api/articles/100000000/comments")
                .expect(404)
                .send(newComment)
                .then((response) => {
                    const message = { msg: `No article found for article_id: 100000000` };
                    expect(response.body).toEqual(message);
                })
        })

        test('should return bad request if input is empty', () => {

            return request(app)
                .post('/api/articles/1/comments')
                .send({})
                .expect(400)
                .then((response) => {
                    const message = { msg: "Empty input submitted" }
                    expect(response.body).toEqual(message)
                })
        })

    });
    test('should return bad request if username key is incorrect', () => {
        return request(app)
            .post('/api/articles/1/comments')
            .send({
                user: 'hello',
                body: 'test'
            })
            .expect(400)
            .then((response) => {
                const message = { msg: "incorrect key submitted, should be username & body" }
                expect(response.body).toEqual(message)
            })
    });
    test('should return bad request if body key is incorrect', () => {
        return request(app)
            .post('/api/articles/1/comments')
            .send({
                username: 'hello',
                wrong: 'test'
            })
            .expect(400)
            .then((response) => {
                const message = { msg: "incorrect key submitted, should be username & body" }
                expect(response.body).toEqual(message)
            })
    });
    test('should return bad request if username value is not typeof string', () => {
        return request(app)
            .post('/api/articles/1/comments')
            .send({
                username: 2,
                body: 'test'
            })
            .expect(400)
            .then((response) => {
                const message = { msg: "Username must be a string" }
                expect(response.body).toEqual(message)
            })
    });
    test('should return bad request if body value is not typeof string', () => {
        return request(app)
            .post('/api/articles/1/comments')
            .send({
                username: 'test',
                body: 3
            })
            .expect(400)
            .then((response) => {
                const message = { msg: "Body must be a string" }
                expect(response.body).toEqual(message)
            })
    });
    describe('HAPPY PATH GET /api/articles/:article_id/comments', () => {
        test('200 OK - Should return an array of objects with correct data', () => {
            return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then((response) => {
                    expect(response.body.comments).toBeInstanceOf(Array),
                        expect(response.body.comments.length).toBeGreaterThan(0),
                        response.body.comments.forEach(comment => {
                            expect(comment).toEqual(expect.objectContaining({
                                author: expect.any(String),
                                comment_id: expect.any(Number),
                                body: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                            }))
                        })
                })
        })
        test('200 OK - Should return an empty array of article has no comments', () => {
            return request(app)
                .get("/api/articles/2/comments")
                .expect(200)
                .then((response) => {
                    console.log(response)
                    expect(response.body.comments).toBeInstanceOf(Array),
                        expect(response.body.comments.length).toBe(0)
                });
        })
    })

    describe('SAD PATH GET /api/articles/:article_id/comments', () => {
        test('should respond 400 if bad request on ID', () => {
            return request(app)
                .get('/api/articles/not-a-number/comments')
                .expect(400)
                .then((response) => {
                    const message = { msg: "Bad request - not a ID number" };
                    expect(response.body).toEqual(message);
                })
        });
        test('should respond 404 if path valid but not found', () => {
            return request(app)
                .get("/api/articles/100000000/comments")
                .expect(404)
                .then((response) => {
                    const message = { msg: `No article found for article_id: 100000000` };
                    expect(response.body).toEqual(message);
                })
        })
    })
});

