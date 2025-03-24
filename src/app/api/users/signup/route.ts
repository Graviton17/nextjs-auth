import connect from "@/dbConfig/dbConfig";
import { User } from "@/models/users.models";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All field are requried(username, email, password)" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: encryptedPassword,
    });

    return NextResponse.json(
      {
        user: newUser,
        message: "User created successfully",
        success: true,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
