"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { completeOnboarding } from "./_actions";

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

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (formData: FormData) => {
    //await completeOnboarding(formData);

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
        <form action={handleSubmit}>
          <div className="space-y-4 px-8 pb-8">
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
