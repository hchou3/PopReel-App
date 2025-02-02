"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { video_db, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { getAllUsers } from "../debug-tools/db_debugging";

async function createUser(userName: string, interests: string[]) {
  try {
    const existingUser = await video_db
      .select()
      .from(users)
      .where(eq(users.userName, userName));

    if (existingUser.length > 0) {
      console.log("User already exists:", existingUser[0]);
      return existingUser[0];
    }

    const newUser = await video_db
      .insert(users)
      .values({
        userName,
        interests,
      })
      .returning();
    console.log("Inserted new user:", newUser[0]);
    return newUser[0];
  } catch (error) {
    console.error("Error checking/inserting user:", error);
    return null;
  }
}

export const completeOnboarding = async (formData: FormData) => {
  const client = await clerkClient();
  const { userId } = await auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  try {
    const interests: string[] = [];
    const entries = Array.from(formData.entries());
    for (const [key, value] of entries) {
      if (key.startsWith("interests[")) {
        interests.push(value as string);
      }
    }

    const new_username = formData.get("username") as string;

    await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        username: new_username,
        interests,
      },
    });

    createUser(new_username, interests);
    const allUsers = await getAllUsers();
    console.log("User Database:", allUsers);

    return { message: "User metadata Updated" };
  } catch (e) {
    console.log("error", e);
    return { message: "Error Updating User Metadata" };
  }
};
