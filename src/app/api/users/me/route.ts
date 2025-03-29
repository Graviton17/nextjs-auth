import { getTokenDataFromCookies } from "@/helpers/getTokenDataFromCookies";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/users.models";

// Remove the default keyword
export async function GET(request: NextRequest) {
  try {
    const userId = await getTokenDataFromCookies(request);
    console.log("User ID from token:", userId); // Log the userId for debugging

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId).select("-password");

    return NextResponse.json(
      {
        message: "User data fetched successfully",
        data: user,
        success: true,
      },
      { status: 200 } // Changed from 201 to 200 (201 is for creation)
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to fetch user data, ${error}` },
      { status: 500 }
    );
  }
}
