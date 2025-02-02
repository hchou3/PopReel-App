import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "crypto";
import { video_db, videos } from "../../db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { file, contentType } = body;
    console.log("Processing video upload request:", file.name);

    const fileBuffer = Buffer.from(file, "base64");
    const filename = `videos/${crypto.randomUUID()}.${contentType}`;
    console.log("creating filebuffer and putting into: " + filename);

    const blob = await put(filename, fileBuffer, {
      access: "public",
      contentType: contentType,
    });

    const reel = {
      video_name: file.name,
      genre: "",
      blob_ref: blob.url,
      userName: "",
      summary: "",
      transcript: "",
      embedding: null,
    };

    await video_db.insert(videos).values(reel).returning();

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
