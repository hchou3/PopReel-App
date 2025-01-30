"use client";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { ClerkProvider } from "@clerk/clerk-react";
import "./home.css";
import { drizzle } from "drizzle-orm/node-postgres";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { generate_transcript } from "./components/generate-embeddings";

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function Home() {
  const [state, setState] = useState("ready");
  const [video, setVideo] = useState<File | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);

  async function handleOnSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!video) {
      console.log("No video file selected.");
      return;
    }

    if (video.type !== "video/mp4") {
      console.log("Invalid file type. Please select a video file."); //Upload a video to the website through a button
      return;
    }
    setVideoName(video.name);
    console.log("uploaded video:", video.name);
    setState("set");

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve(reader.result?.toString().split(",")[1] || "");
      reader.onerror = reject;
      reader.readAsDataURL(video);
    });

    const response = await fetch("/api/upload-videos", {
      //Add video to blob
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: base64,
        contentType: video.type,
      }),
    });

    console.log(response);
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
            <button className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold">
              Upload Video
            </button>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <button className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold">
                Sign in
              </button>
            </SignInButton>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <form onSubmit={handleOnSubmit} className="w-full">
                <input type="file" onChange={handleOnChange} />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold"
                >
                  Submit Video
                </button>
              </form>
              {videoName && (
                <div className="mt-4 text-sm text-gray-700">
                  <strong>Uploaded Video:</strong> {videoName}
                </div>
              )}
            </div>
          </SignedOut>
        </div>
      </main>
    </>
  );
}
