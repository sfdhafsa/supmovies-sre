import test from "node:test";
import assert from "node:assert/strict";
import { requireRole } from "../src/middlewares/role.middleware.js";

const runAdminGate = (user) => {
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

  requireRole("ADMIN")({ user }, response, () => {
    nextCalls += 1;
  });

  return { response, nextCalls };
};

test("rejects requests without an authenticated user", () => {
  const { response, nextCalls } = runAdminGate(undefined);

  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.body, { message: "Non authentifié." });
  assert.equal(nextCalls, 0);
});

test("rejects an authenticated user without the required role", () => {
  const { response, nextCalls } = runAdminGate({ roles: ["user"] });

  assert.equal(response.statusCode, 403);
  assert.deepEqual(response.body, { message: "Accès refusé." });
  assert.equal(nextCalls, 0);
});

test("allows a user with the required role", () => {
  const { response, nextCalls } = runAdminGate({ roles: ["admin"] });

  assert.equal(response.statusCode, null);
  assert.equal(response.body, null);
  assert.equal(nextCalls, 1);
});
