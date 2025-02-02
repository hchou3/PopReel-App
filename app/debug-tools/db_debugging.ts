import { video_db, users, videos } from "../db/schema"; // Adjust the import path as necessary

export async function getAllUsers() {
  try {
    const allUsers = await video_db.select().from(users);
    console.log("Users in the database:", allUsers);
    return allUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

export async function getAllVideos() {
  try {
    const allUsers = await video_db.select().from(videos);
    console.log("Videos in the database:", allUsers);
    return allUsers;
  } catch (error) {
    console.error("Error fetching videos:", error);
  }
}
