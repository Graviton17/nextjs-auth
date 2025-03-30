import { NextResponse, NextRequest } from "next/server";
import connect from "@/dbConfig/dbConfig";
import { User } from "@/models/users.models";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    if (!email) {
      return NextResponse.json(
        {
          error: "Email is required",
          success: false,
        },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Don't reveal whether a user exists for security
    if (!user) {
      // Still return success to prevent email enumeration attacks
      return NextResponse.json(
        {
          message:
            "If your email is registered, you will receive password reset instructions",
          success: true,
        },
        { status: 200 }
      );
    }

    // Send password reset email
    await sendEmail({
      email: user.email,
      emailType: "FORGOT", // Use "RESET" instead of "VERIFY"
      userId: user._id,
    });

    return NextResponse.json(
      {
        message: "Password reset email sent successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      {
        error: "Failed to process password reset request",
        success: false,
      },
      { status: 500 }
    );
  }
}
