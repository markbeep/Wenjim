import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // proxies api requests to the backend service
  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.rewrite(
      new URL(
        request.nextUrl.pathname.replace("/api/", ""),
        `${process.env.BACKEND_PROXY}`,
      ),
    );
  }
}
