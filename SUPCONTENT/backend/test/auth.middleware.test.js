import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";

// Importing the middleware initializes the PostgreSQL pool. These tests reject
// requests before any database query, so provide non-production settings only.
delete process.env.DATABASE_URL;
process.env.DB_PASSWORD = "test-only-placeholder";
process.env.JWT_SECRET = "test-only-jwt-secret";

const { protect } = await import("../src/middlewares/auth.middleware.js");

const runProtect = async (authorization) => {
  const response = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
  let nextCalls = 0;
  const headers = authorization ? { authorization } : {};

  await protect({ headers }, response, () => {
    nextCalls += 1;
  });

  return { response, nextCalls };
};

test("rejects a request without a bearer token", async () => {
  const { response, nextCalls } = await runProtect(undefined);

  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.body, { message: "Token manquant." });
  assert.equal(nextCalls, 0);
});

test("rejects a malformed bearer token", async () => {
  const { response, nextCalls } = await runProtect("Bearer not-a-jwt");

  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.body, { message: "Token invalide ou expiré." });
  assert.equal(nextCalls, 0);
});

test("rejects an expired bearer token", async () => {
  const expiredToken = jwt.sign(
    { sub: "test-user", roles: ["user"] },
    process.env.JWT_SECRET,
    {
      expiresIn: -1,
      issuer: "supcontent-api",
      audience: "supcontent-client",
    },
  );
  const { response, nextCalls } = await runProtect(`Bearer ${expiredToken}`);

  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.body, { message: "Token invalide ou expiré." });
  assert.equal(nextCalls, 0);
});
