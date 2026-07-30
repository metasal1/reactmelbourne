import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(req: NextRequest) {
  const host = req.headers.get("host")?.toLowerCase() ?? "";
  if (host === "www.reactmelbourne.com") {
    const url = req.nextUrl.clone();
    url.host = "reactmelbourne.com";
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  if (!req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const expectedUser = process.env.ADMIN_USER ?? "";
  const expectedPass = process.env.ADMIN_PASS ?? "";

  if (!expectedUser || !expectedPass) {
    return new NextResponse("admin not configured", { status: 503 });
  }

  const auth = req.headers.get("authorization") ?? "";
  if (auth.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice("Basic ".length));
      const sep = decoded.indexOf(":");
      const user = sep === -1 ? decoded : decoded.slice(0, sep);
      const pass = sep === -1 ? "" : decoded.slice(sep + 1);
      if (user === expectedUser && pass === expectedPass) {
        return NextResponse.next();
      }
    } catch {
      // fall through
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="reactmelbourne admin", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}
