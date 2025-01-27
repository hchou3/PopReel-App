import { defineConfig } from "drizzle-kit";
import {
  integer,
  pgTable,
  varchar,
  text,
  vector,
  json,
} from "drizzle-orm/pg-core";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(process.env.DATABASE_URL!);

export const videos = pgTable("videos", {
  id: integer("id").primaryKey(),
  video_name: varchar("name", { length: 255 }).notNull(),
  genre: varchar("genre", { length: 255 }).notNull(),
  blob_ref: text("reference").notNull(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  embedding: vector("embedding", { dimensions: 1536 }),
  likes: integer("likes").default(0).notNull(), // Number of likes
  comments: json("comments").default([]).notNull(),
});

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
