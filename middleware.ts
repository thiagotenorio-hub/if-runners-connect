import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "if_runners_admin";

function isProtectedPath(pathname: string) {
  return pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.get(ADMIN_COOKIE)?.value === "1";

  if (hasSession) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json(
      { message: "Acesso administrativo nao autenticado." },
      { status: 401 }
    );
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
