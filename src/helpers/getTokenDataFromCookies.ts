import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getTokenDataFromCookies = (request: NextRequest) => {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return "";
    }

    const decodedToken:any = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    );

    return decodedToken.id;
  } catch (error: any) {
    console.error("Error decoding token:", error.message);
  }
};
