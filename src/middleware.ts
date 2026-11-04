import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Interceptar tentativas de acesso a páginas administrativas
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const adminToken = req.cookies.get("nova_admin_token")?.value;

    if (!adminToken) {
      // Visitante não autenticado: redireciona para a tela de login administrativo
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Interceptar rotas de API administrativas privadas
  if (pathname.startsWith("/api/admin") && pathname !== "/api/admin/login" && pathname !== "/api/admin/session") {
    const adminToken = req.cookies.get("nova_admin_token")?.value;

    if (!adminToken) {
      return NextResponse.json(
        { error: "Acesso restrito. Autenticação administrativa obrigatória." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
