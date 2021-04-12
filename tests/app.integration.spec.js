// test/app.integration.spec.js
const { response } = require("express");
const request = require("supertest");
const app = require("../app");
const connection = require("../connection");

describe("Test routes", () => {
  // truncate bookmark table before each test
  const testBookmark = { url: "https://nodejs.org/", title: "Node.js" };
  beforeEach((done) =>
    connection.query("TRUNCATE bookmark", () =>
      connection.query("INSERT INTO bookmark SET ?", testBookmark, done)
    )
  );

  it('GET / sends "Hello World" as json', (done) => {
    request(app)
      .get("/")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        const expected = { message: "Hello World!" };
        expect(response.body).toEqual(expected);
        done();
      });
  });

  it("POST to /bookmarks fails if empty form", (done) => {
    request(app)
      .post("/bookmarks")
      .send({})
      .expect(422)
      .expect("Content-Type", /json/)
      .then((response) => {
        const expected = { error: "required field(s) missing" };
        expect(response.body).toEqual(expected);
        done();
      });
  });

  it("POST to /bookmarks if required fields are filled", (done) => {
    request(app)
      .post("/bookmarks")
      .send({ url: "https://jestjs.io", title: "Jest" })
      .expect(201)
      .expect("Content-Type", /json/)
      .then((response) => {
        const expected = {
          id: 2,
          url: "https://jestjs.io",
          title: "Jest",
        };
        expect(response.body).toEqual(expected);
        done();
      });
  });

  it("GET error if  bookmark ID doesnt exist", (done) => {
    request(app)
      .get(`/bookmarks/${42}`)
      .expect(404)
      .then((response) => {
        const expected = { error: "Bookmark not found" };
        expect(response.body).toEqual(expected);
        done();
      });
  });

  it("GET bookmark data object if givent ID exist", (done) => {
    request(app)
      .get(`/bookmarks/${1}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        const expected = {
          id: 1,
          title: "Node.js",
          url: "https://nodejs.org/",
        };
        expect(response.body).toEqual(expected);
        done();
      });
  });
});
