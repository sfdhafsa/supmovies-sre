import test from "node:test";
import assert from "node:assert/strict";

// The service imports the pool at module load. These tests replace its query
// method, so no database connection is made.
delete process.env.DATABASE_URL;
process.env.DB_PASSWORD = "test-only-placeholder";

const [{ default: db }, { getListById }] = await Promise.all([
  import("../src/config/db.js"),
  import("../src/services/library/customList.service.js"),
]);

const privateList = {
  id: "list-1",
  user_id: "owner-1",
  name: "Private list",
  is_public: false,
};

test("rejects a private list when the viewer is not its owner", async () => {
  const originalQuery = db.query;
  let queryCalls = 0;
  db.query = async () => {
    queryCalls += 1;
    return { rows: [privateList] };
  };

  try {
    await assert.rejects(
      getListById(privateList.id, "viewer-2"),
      (error) => error.status === 403,
    );
    assert.equal(queryCalls, 1, "the service must reject before loading list movies");
  } finally {
    db.query = originalQuery;
  }
});

test("allows the owner to read a private list", async () => {
  const originalQuery = db.query;
  let queryCalls = 0;
  const movies = [{ id: "movie-1", title: "Test movie" }];
  db.query = async () => {
    queryCalls += 1;
    return queryCalls === 1 ? { rows: [privateList] } : { rows: movies };
  };

  try {
    const result = await getListById(privateList.id, privateList.user_id);

    assert.equal(result.id, privateList.id);
    assert.deepEqual(result.movies, movies);
    assert.equal(queryCalls, 2);
  } finally {
    db.query = originalQuery;
  }
});
