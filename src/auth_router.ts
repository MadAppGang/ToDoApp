import { Hono } from "hono";
import { faker } from "@faker-js/faker";

const authRouter = () => {
  const router = new Hono();

  router.post("/login", async (c) => {
    const body = await c.req.json();
    if (!body.username || !body.password) {
      return c.json({ error: "username and password are required" }, 400);
    }
    // for user and password comnitation we return an error
    if (body.username === "user" && body.password === "password") {
      return c.json({ error: "invalid username or password" }, 401);
    }

    //for any other combination we return a token
    return c.json({
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      user: {
        id: faker.string.uuid(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
      },
    });
  });

  router.get("/logout", async (c) => {
    return c.json({ message: "Logged out" });
  });

  return router;
};

export default authRouter;
