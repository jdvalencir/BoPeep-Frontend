import { NextResponse } from "next/server";

export async function PUT(req) {
    console.log("Request:", req);
    const cookies = req.headers.get("cookie") || "";
    const accessToken = cookies
      .split(";")
      .find((c) => c.trim().startsWith("accessToken="))
      ?.split("=")[1];
  
    if (!accessToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
  
    try {
        const response = await fetch(`https://api.marcianos.me/v1/events/documents/authenticateFile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ file_name: body.file_name, url_document: body.url_document }),
      });

      console.log("Response:", response);  
  
      const data = await response.json();
      return NextResponse.json(data);
    } catch (err) {
      return NextResponse.json({ error: "Error al obtener el documento" }, { status: 500 });
    }
  }