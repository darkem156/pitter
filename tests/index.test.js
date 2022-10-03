const app = require("../src/server.js")
const request = require("supertest")

describe("API Testing", () =>
{
  test("Get publications without login should respond with 401", async () =>
  {
    const res = await request(app).get("/api/getPublications").send();
    expect(res.status).toEqual(401)
  })
  
  test("Get publications with login should respond with a json", async () =>
  {
    const res = await request(app).get("/api/getPublications").set("Cookie", "cookie-session=s%3AZoTqrBhKh3ymipSSIF0LFkWeD0hJ41lq.IteeE5FpSm53X8VfVxkNcb%2FcvYHJ5M3DKKj%2FMs0z4%2BI").send()
    expect(res.status).toEqual(200)
    expect(res.body).toBeInstanceOf(Object);
  })

  test("Get session without login should respond with 401 and session false", async () =>
  {
    const res = await request(app).get("/api/getSession").send()
    expect(res.status).toEqual(401)
    expect(res.body.session).toEqual(false)
  })

  test("Get session with login should respond with 200 and session true", async() =>
  {
    const res = await request(app).get("/api/getSession").set("Cookie", "cookie-session=s%3AZoTqrBhKh3ymipSSIF0LFkWeD0hJ41lq.IteeE5FpSm53X8VfVxkNcb%2FcvYHJ5M3DKKj%2FMs0z4%2BI").send()
    expect(res.status).toBe(200)
    expect(res.body.session).toEqual(true)
  })
})

describe("api/publication Testing", () =>
{
  test("Get existing publication should respond with 200 and json", async() =>
  {
    const res = await request(app).get("/api/publication/1").send()
    expect(res.status).toBe(200)
    expect(res.body).toBeInstanceOf(Object)
  })

  test("Get non existing publication should respond with 404", async() =>
  {
    const res = await request(app).get("/api/publication/10000").send()
    expect(res.status).toEqual(404)
  })

  test("Publish without login should respond with 401", async () =>
  {
    const res = await request(app).post("/api/publication/publish").send()
    expect(res.status).toEqual(401)
  })

  test("Publish with login and content should respond with 201", async () =>
  {
    const res = await request(app).post("/api/publication/publish").set("Cookie", "cookie-session=s%3AZoTqrBhKh3ymipSSIF0LFkWeD0hJ41lq.IteeE5FpSm53X8VfVxkNcb%2FcvYHJ5M3DKKj%2FMs0z4%2BI").send({ content: "ola" })
    expect(res.status).toEqual(201)
  })

  test("Publish with login but non content should respond with 400", async () =>
  {
    const res = await request(app).post("/api/publication/publish").set("Cookie", "cookie-session=s%3AZoTqrBhKh3ymipSSIF0LFkWeD0hJ41lq.IteeE5FpSm53X8VfVxkNcb%2FcvYHJ5M3DKKj%2FMs0z4%2BI").send()
    expect(res.status).toEqual(400)
  })
})

describe("SignUp testing", () =>
{
  test("api/signUp without user, name, email or invalid email, or without password should respond with 400", async () =>
  {
    const tests = 
    [
      { user_name: `ola`, name: "ola", email: `ola`, password: "ola" },
      { user_name: `ola`, name: "ola", email: `ola@gmail.com` },
      { user_name: `ola`, name: "ola", password: "olagmail.com" },
      { user_name: `ola`, password: "ola", email: `ola@gmail.com` },
      { name: "ola", password: "ola", email: `ola@gmail.com` },
    ]

    tests.map(async object =>
    {
      const res = await request(app).post("/api/signUp").send(object);
      expect(res.status).toEqual(400)
    })
  })

  test("api/signUp with existing user or email should respond with 409", async() =>
  {
    const resEmail = await request(app).post("/api/signUp").send({
      user_name: `ola${ Math.random().toFixed(4) }`,
      name: "ola",
      email: "ola@gmail.com",
      password: "ola"
    })
    expect(resEmail.status).toEqual(409);
    
    const resUser = await request(app).post("/api/signUp").send({
      user_name: "ola",
      name: "ola",
      email: `ola${ Math.random().toFixed(4) }@gmail.com`,
      password: "ola"
    })
    expect(resUser.status).toEqual(409)
  })

  test("api/signUp with new user and new email should respond with 201", async () =>
  {
    const res = await request(app).post("/api/signUp").send({
      user_name: `ola${ Math.random().toFixed(4) }`,
      name: "ola",
      email: `ola${ Math.random().toFixed(4) }@gmail.com`,
      password: "ola"
    })
    expect(res.status).toEqual(201)
  })
})

describe("SignIn testing", () =>
{
  test("api/signIn without data or whithout password should respond with 400", async () =>
  {
    const res = await request(app).post("/api/signIn").send();
    expect(res.status).toEqual(400)

    const resWData = await request(app).post("/api/signIn").send({ dato: "ola" });
    expect(resWData.status).toEqual(400)

    const resWPass = await request(app).post("/api/signIn").send({ password: "ola" });
    expect(resWPass.status).toEqual(400)
  })

  test("api/signIn with data and password from existing user should respond with id_user", async() =>
  {
    const res = await request(app).post("/api/signIn").send({ dato: "ola", password: "ola" });
    expect(res.body.id_user).toBeDefined();
  })

  test("api/signIn with invalid credentials should respond with an error", async () =>
  {
    const res = await request(app).post("/api/signIn").send({ dato: "olaaaaaa", password: "ola" });
    expect(res.body.error).toBeDefined();
  })
})

describe("api/user Testing", () =>
{
  test("Get existing user should respond with json", async () =>
  {
    const res = await request(app).get("/api/user/1").send()
    expect(res.body).toBeInstanceOf(Object)
  })

  test("Get non existing user should respond with 404", async () =>
  {
    const res = await request(app).get("/api/user/100").send()
    expect(res.status).toEqual(404)
  })

  test("Following and unfollowing user without login respond with 401", async () =>
  {
    const follow = await request(app).get("/api/user/1/follow").send()
    expect(follow.status).toEqual(401)

    const unFollow = await request(app).get("/api/user/1/unFollow").send()
    expect(unFollow.status).toEqual(401)
  })

  test("Following and unfollowing user with login respond with 201 and 205 respectively", async () =>
  {
    const follow = await request(app).get("/api/user/1/follow").set("Cookie", "cookie-session=s%3AZoTqrBhKh3ymipSSIF0LFkWeD0hJ41lq.IteeE5FpSm53X8VfVxkNcb%2FcvYHJ5M3DKKj%2FMs0z4%2BI").send()
    expect(follow.status).toEqual(201)

    const unFollow = await request(app).get("/api/user/1/unFollow").set("Cookie", "cookie-session=s%3AZoTqrBhKh3ymipSSIF0LFkWeD0hJ41lq.IteeE5FpSm53X8VfVxkNcb%2FcvYHJ5M3DKKj%2FMs0z4%2BI").send()
    expect(unFollow.status).toEqual(205)
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
