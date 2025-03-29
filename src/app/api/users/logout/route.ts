import connect from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";

connect();

export async function GET() {
  try {
    const response = NextResponse.json(
      { message: "User logged out successfully", success: true },
      { status: 200 }
    );

    response.cookies.delete("refreshToken");

    return response;
  } catch {
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
