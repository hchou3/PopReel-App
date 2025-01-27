import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "crypto";

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

    return NextResponse.json({
      success: true,
      imageUrl: blob.url,
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    return NextResponse.json(
      { error: "An error occurred while uploading the video." },
      { status: 500 }
    );
  }
}
