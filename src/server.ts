import { Hono } from "hono";
import { logger } from "hono/logger";
import authRouter from "./auth_router.ts";
import todoRouter from "./todo_router.ts";
import { cors } from 'hono/cors'

const app = new Hono({strict: false});
app.use("*", logger());
app.use("*", cors())

app.get("/test", (c) => {
  return c.json({ message: "Test passed" });
});

app.route("/api", todoRouter());
app.route("/auth", authRouter());

export default app;
