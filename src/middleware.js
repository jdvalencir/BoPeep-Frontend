import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isAuthPage =
    pathname === "/" ||
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register");
  const isProtectedPage = pathname.startsWith("/home");

  // Función para validar el token
  async function validate(token) {
    try {
      const res = await fetch("https://api.marcianos.me/v1/auth/validateToken", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Validando token:", res.ok);
      return res.ok;
    } catch {
      return false;
    }
  }

  // --- 1. Ruta protegida, pero token inválido ---
  if (isProtectedPage) {
    if (accessToken && await validate(accessToken)) {
      return NextResponse.next();
    }

    // Intentar refresh si el token es inválido
    if (refreshToken) {
      try {
        const refreshRes = await fetch("https://api.marcianos.me/v1/auth/refreshToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          console.log("Token refrescado exitosamente.");
          const data = await refreshRes.json();
          const response = NextResponse.next();
          response.cookies.set("accessToken", data.access_token, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60, // 15 minutos
          });
          response.cookies.set("refreshToken", data.refresh_token, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30,
          });
          return response;
        }
      } catch (err) {
        console.error("Error refrescando token:", err);
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
    }

    // No token o no se pudo refrescar → login
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // --- 2. Ruta pública, pero ya está autenticado ---
  if (isAuthPage && accessToken && await validate(accessToken)) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*'],
};