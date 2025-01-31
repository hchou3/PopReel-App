"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { completeOnboarding } from "./_actions";
import { video_db, users } from "../db/schema";
import { eq } from "drizzle-orm";

const videoCategories = [
  "Comedy",
  "Music",
  "Sports",
  "Gaming",
  "Education",
  "Lifestyle",
  "Food",
  "Travel",
  "Tech",
];

export default function OnboardingComponent() {
  const { user } = useUser();
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [username, setUsername] = useState<string>("");

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else if (prev.length < 3) {
        return [...prev, category];
      } else {
        return prev;
      }
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    selectedCategories.forEach((category, index) => {
      formData.append(`interests[${index}]`, category);
    });

    const existingUser = await video_db
      .select()
      .from(users)
      .where(eq(users.userName, username)) // Use the correct property name
      .execute();

    if (existingUser) {
      alert("Username already exists. Please choose a different username.");
      return;
    }

    await completeOnboarding(formData);
    await video_db
      .insert(users)
      .values({ userName: user?.username ?? "", interests: selectedCategories })
      .execute();

    await user?.reload();
    router.push("/dashboard");
  };
  return (
    <div className="px-8 py-12 sm:py-16 md:px-20">
      <div className="mx-auto max-w-sm overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="p-8">
          <h3 className="text-xl font-semibold text-gray-900">
            Select Your Top 3 Interests
          </h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-8 pb-8">
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {videoCategories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={`px-4 py-2 rounded ${
                    selectedCategories.includes(category)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 px-8 py-4">
            <button
              type="submit"
              className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
