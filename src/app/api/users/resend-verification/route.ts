import { sendEmail } from "@/helpers/mailer";
import { User } from "@/models/users.models";
import { NextResponse, NextRequest } from "next/server";
import connect from "@/dbConfig/dbConfig";
import { getTokenDataFromCookies } from "@/helpers/getTokenDataFromCookies";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getTokenDataFromCookies(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "User already verified" },
        { status: 400 }
      );
    }

    await sendEmail({
      email: user.email,
      emailType: "VERIFY",
      userId: user._id,
    });
    return NextResponse.json(
      { message: "Verification email sent successfully", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to fetch user data, ${error}` },
      { status: 500 }
    );
  }
}
