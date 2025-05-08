import { NextResponse } from "next/server";

export async function GET(req) {
    const cookies = req.headers.get("cookie") || "";
    const accessToken = cookies
      .split(";")
      .find((c) => c.trim().startsWith("accessToken="))
      ?.split("=")[1];
  
    if (!accessToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  
    try {
      const response = await fetch("https://api.marcianos.me/v1/documents/folder", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const data = await response.json();
      return NextResponse.json(data);
    } catch (err) {
      return NextResponse.json({ error: "Error al obtener documents" }, { status: 500 });
    }
  }