const app = require("../src/server.js")
const request = require("supertest")

describe("API Testing", () =>
{
  test("Get publications without login should respond with 403", async () =>
  {
    const res = await request(app).get("/api/getPublications").send();
    expect(res.status).toEqual(403)
  })
  
  test("Get publications with login should respond with a json", async () =>
  {
    const res = await request(app).get("/api/getPublications").set("Cookie", "cookie-session=s%3AZoTqrBhKh3ymipSSIF0LFkWeD0hJ41lq.IteeE5FpSm53X8VfVxkNcb%2FcvYHJ5M3DKKj%2FMs0z4%2BI").send()
    expect(res.status).toEqual(200)
    expect(res.body).toBeInstanceOf(Object);
  })
})

describe("Front-End Testing", () =>
{
  test("Should respond with 200", async () =>
  {
    const res = await request(app).get("/user/1").send()
    expect(res.status).toBe(200)
  })
})
