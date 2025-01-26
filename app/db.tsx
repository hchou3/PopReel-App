const { Pool } = require("pg");

export const pool = new Pool({
  user: "your-username",
  host: "localhost",
  database: "your-database",
  password: "your-password",
  port: 5432,
});

export const createTableQuery = `
  CREATE TABLE IF NOT EXISTS videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    account VARCHAR(100) NOT NULL,
    embedded_link TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    comments TEXT[] DEFAULT '{}'
  );
`;

(async () => {
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log('Table "videos" is successfully created or already exists.');
    client.release();
  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    await pool.end();
  }
})();

type Video = {
  id?: number;
  title: string;
  account: string;
  embeddedLink: string;
  likeCount?: number;
  comments?: string[];
};
