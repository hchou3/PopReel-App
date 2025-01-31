"use client";

import { UserDetails } from "../components/user-details";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { users, video_db } from "../db/schema";

export default async function DashboardPage() {
  const { user } = useUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  const username: string =
    typeof user?.publicMetadata?.username === "string"
      ? user.publicMetadata.username
      : "No username found";
  const existingUser = await video_db
    .select()
    .from(users)
    .where(eq(users.userName, username)) // ✅ Use eq() for filtering
    .execute();

  return (
    <div>
      <h1>
        Welcome, {user.firstName} {user.lastName}
      </h1>
      <p>Email: {user.emailAddresses[0].emailAddress}</p>
      <p>Username: {existingUser[0]?.userName}</p>
      <p>Public Metadata: {JSON.stringify(user.publicMetadata)}</p>
    </div>
  );
}
