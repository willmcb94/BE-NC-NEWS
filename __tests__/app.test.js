const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data")

beforeEach(() => seed(data));
afterAll(() => db.end())

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
    describe('SAD PATH GRT /api/topics', () => {
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

});