import connect from "@/dbConfig/dbConfig";
import { User } from "@/models/users.models";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    if (!email || !password) {
      return NextResponse.json(
        { error: "All field are requried(email, password)" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    const tokenData = {
      id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
    };

    const accessToken = jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECERT!, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      {
        user: existingUser,
        accessToken,
        message: "User logged in successfully",
        success: true,
      },
      { status: 200 }
    );

    // Set refresh token in HTTP-only cookie
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    interface JwtPayload {
      id: string;
      iat: number;
      exp: number;
    }

    // Verify the token
    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JwtPayload;

    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate a new access token with complete user info
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const accessToken = jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECERT!, {
      expiresIn: "15m",
    });

    return NextResponse.json({
      user,
      accessToken,
      message: "Auto-login successful",
      success: true,
    });
  } catch (error) {
    console.error("Token verification error:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    } else if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}
