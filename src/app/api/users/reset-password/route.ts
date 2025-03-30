import { NextResponse, NextRequest } from "next/server";
import connect from "@/dbConfig/dbConfig";
import { User } from "@/models/users.models";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token, password } = reqBody;

    if (!token || !password) {
      return NextResponse.json(
        {
          error: "Token and password are required",
          success: false,
        },
        { status: 400 }
      );
    }

    // Find user with valid reset token
    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid or expired token",
          success: false,
        },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Update user's password and clear reset token
    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    return NextResponse.json(
      {
        message: "Password reset successful",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      {
        error: "Failed to reset password",
        success: false,
      },
      { status: 500 }
    );
  }
}
