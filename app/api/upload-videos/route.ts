import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "crypto";
import { video_db, videos } from "../../db/schema";

interface ReelData {
  id: string;
  video_name: string;
  genre: string;
  blob_ref: string;
  userName: string;
  embedding?: number[] | null;
  likes: number;
  comments: any[];
}

async function createReel(data: Omit<ReelData, "id">): Promise<ReelData> {
  const newReel = await video_db
    .insert(videos)
    .values({
      video_name: data.video_name,
      genre: data.genre,
      blob_ref: data.blob_ref,
      userName: data.userName,
      embedding: data.embedding,
      likes: data.likes,
      comments: data.comments,
    })
    .returning();

  return { ...newReel[0], comments: newReel[0].comments as any[] };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { file, contentType } = body;
    console.log("Uploading video:", file.name);

    const fileBuffer = Buffer.from(file, "base64");
    const filename = `videos/${crypto.randomUUID()}.mp4`;

    console.log(filename);
    const blob = await put(filename, fileBuffer, {
      access: "public",
      contentType: contentType,
    });

    const reel = await createReel({
      video_name: file.name,
      genre: "",
      blob_ref: blob.url,
      userName: "",
      embedding: null,
      likes: 0,
      comments: [],
    });

    return NextResponse.json({
      success: true,
      videoUrl: blob.url,
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    return NextResponse.json(
      { error: "An error occurred while uploading the video." },
      { status: 500 }
    );
  }
}
