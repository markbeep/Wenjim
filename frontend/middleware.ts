import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // proxies api requests to the envoy service
    if (request.nextUrl.pathname.startsWith("/api")) {
        return NextResponse.rewrite(new URL(request.nextUrl.pathname, `${process.env.ENVOY_PROXY}`));
    }
}
