// Write your tests here
const request = require("supertest");
const db = require("../data/dbConfig");
const server = require("../api/server");

test("sanity", () => {
  expect(true).toBe(true);
});

const userOne = {
  id: 1,
  username: "myUsername",
  password: "1234",
};
const userTwo = {
  id: 2,
  username: "thisUsername",
  password: "4321",
};

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate();
});

afterAll(async () => {
  await db.destroy();
});

describe("[POST] Register", () => {
  test("Register a new User", async () => {
    await request(server).post("/api/auth/register").send(userOne);
    const user = await db("users").where("username", "myUsername").first();
    expect(user).toMatchObject({ username: "myUsername" });
  });
  test("Register responds with 'username taken'", async () => {
    await request(server).post("/api/auth/register").send(userOne);
    const response = await request(server)
      .post("/api/auth/register")
      .send(userOne);
    expect(response.body.message).toMatch("username taken");
  });
});

describe("[POST] Login", () => {
  test("Login responds with the correct message", async () => {
    await request(server).post("/api/auth/register").send(userOne);
    const res = await request(server).post("/api/auth/login").send(userOne);
    expect(res.body.message).toMatch("welcome, myUsername");
  });
  test("Login responds with proper message on Invalid Credentials", async () => {
    await request(server).post("/api/auth/register").send(userTwo);
    const res = await request(server).post("/api/auth/login").send(userOne);
    expect(res.body.message).toMatch("invalid credentials");
  });
});