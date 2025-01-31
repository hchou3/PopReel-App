"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

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
    await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        username: formData.get("username") as string, // Store username in metadata
        interests, // Store interests in metadata
      },
    });

    return { message: "User metadata Updated" };
  } catch (e) {
    console.log("error", e);
    return { message: "Error Updating User Metadata" };
  }
};
