import { NextResponse } from "next/server";

export async function POST(req) {
    const cookies = req.headers.get("cookie") || "";
    const accessToken = cookies
      .split(";")
      .find((c) => c.trim().startsWith("accessToken="))
      ?.split("=")[1];
  
    if (!accessToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  
    try {
      const response = await fetch("https://api.marcianos.me/v1/events/documents/deleteFile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ file_name: req.body.file_name }),
      });
  
      const data = await response.json();
  
      return NextResponse.json(data);
    } catch (err) {
      return NextResponse.json({ error: "Error al obtener operadores" }, { status: 500 });
    }
  }