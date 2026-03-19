import pool from "./client";

const migrate = async (): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
            CREATE TABLE IF NOT EXISTS categories (
              id SERIAL PRIMARY KEY,
              name VARCHAR(100) NOT NULL UNIQUE,
              description TEXT,
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);

    await client.query(`
              CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                description TEXT,
                quantity INTEGER NOT NULL DEFAULT 0,
                price NUMERIC(10, 2) NOT NULL,
                category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
                deleted_at TIMESTAMPTZ DEFAULT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
              )
            `);

    await client.query("COMMIT");
    console.log("Migration Successful");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration failed, rolled back:", err);
  } finally {
    client.release();
    await pool.end();
  }
};

migrate();
