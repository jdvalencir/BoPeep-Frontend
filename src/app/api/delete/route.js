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
      // Parse the request body
      const body = await req.json();
      console.log("Request body:", body.file_name);
      
      const response = await fetch("https://api.marcianos.me/v1/events/documents/deleteFile", {
        method: "POST", // Add method - important!
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ file_name: body.file_name }),
      });
  
      const data = await response.json();
  
      return NextResponse.json(data);
    } catch (err) {
      console.error("Error deleting file:", err);
      return NextResponse.json({ error: "Error al borrar un archivo" }, { status: 500 });
    }
  }