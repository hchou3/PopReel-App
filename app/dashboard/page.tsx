"use client";

import { useUser } from "@clerk/nextjs";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import React, { useState } from "react";
import "../home.css";

export default function DashboardPage() {
  const { user } = useUser();
  const [video, setVideo] = useState<File | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);

  async function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const caption = formData.get("caption") as string;
    if (!video) {
      throw new Error("Missing file upload");
    }

    if (!caption) {
      throw new Error("Missing caption");
    }

    if (!video.type.startsWith("video/")) {
      throw new Error("Invalid file type.");
    }
    setVideoName(video.name);
    console.log("Video:", video, video.type);
    console.log(caption);

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === "string") {
          resolve(reader.result.split(",")[1] || "");
        } else {
          reject(new Error("Failed to convert video to Base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(video);
    });

    console.log("Base64:", base64);

    try {
      const response = await fetch("/api/upload-videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: base64,
          contentType: video.type,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Upload successful:", data);
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;

    if (target.files) {
      const file = target.files[0];
      setVideo(file);
    }
  };

  return (
    <>
      <main className="bg-[#FAFAFA] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SignedIn>
            <form onSubmit={handleOnSubmit} className="w-full mt-4">
              <input type="file" onChange={handleOnChange} />
              <input
                type="text"
                name="caption"
                placeholder="Enter video caption"
              />
              <button
                type="submit"
                className="mt-2 px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold"
              >
                Submit Video
              </button>
            </form>
            {videoName && (
              <div className="mt-4 text-sm text-gray-700">
                <strong>Uploaded Video:</strong> {videoName}
              </div>
            )}
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <button className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold">
                Sign in
              </button>
            </SignInButton>
            <div className="mt-20"></div>
            <form onSubmit={handleOnSubmit} className="w-full mt-4">
              <input type="file" onChange={handleOnChange} />
              <input
                type="text"
                name="caption"
                placeholder="Enter video caption"
                className="mt-2 px-4 py-2 border rounded-md w-full"
              />
              <button
                type="submit"
                className="mt-2 px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold"
              >
                Submit Video
              </button>
            </form>
          </SignedOut>
        </div>
      </main>
    </>
  );
}
