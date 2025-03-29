import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/signup";

  const refreshToken = request.cookies.get("refreshToken")?.value || "";

  if (isPublicPath && refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if(!isPublicPath && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/", "/login", "/signup", "/profile"],
};