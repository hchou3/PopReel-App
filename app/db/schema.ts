import { defineConfig } from "drizzle-kit";
import {
  integer,
  pgTable,
  varchar,
  text,
  vector,
  json,
  uuid,
} from "drizzle-orm/pg-core";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

export const videos = pgTable("videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  video_name: varchar("name", { length: 255 }).notNull(),
  genre: varchar("genre", { length: 255 }).notNull(),
  blob_ref: text("reference").notNull(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  embedding: vector("embedding", { dimensions: 1536 }),
  likes: integer("likes").default(0).notNull(),
  comments: json("comments").default([]).notNull(),
});

export const users = pgTable("users", {
  user_id: uuid("user_id").defaultRandom().primaryKey(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  interests: json("interests").default([]).notNull(),
});

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

export const video_db = drizzle(process.env.DATABASE_URL!);
