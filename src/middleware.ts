import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET || "nova_short_super_secret_jwt_key_2026_runtime_987654321";
  return new TextEncoder().encode(secret);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi =
    pathname.startsWith("/api/admin") &&
    pathname !== "/api/admin/login" &&
    pathname !== "/api/admin/session";

  if (isAdminPage || isAdminApi) {
    const adminToken = req.cookies.get("nova_admin_token")?.value;

    let isAuthenticated = false;
    if (adminToken) {
      try {
        const { payload } = await jwtVerify(adminToken, getSecretKey());
        if (payload && payload.sub) {
          isAuthenticated = true;
        }
      } catch {
        isAuthenticated = false;
      }
    }

    if (!isAuthenticated) {
      if (isAdminApi) {
        return NextResponse.json(
          { error: "Acesso restrito. Autenticação administrativa obrigatória ou sessão expirada." },
          { status: 401 }
        );
      }

      const loginUrl = new URL("/admin/login", req.url);
      const res = NextResponse.redirect(loginUrl);
      if (adminToken) {
        // Expurga cookie forjado ou inválido
        res.cookies.delete("nova_admin_token");
      }
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
