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
    console.log("Request body:", body);

    const response = await fetch(
      "https://api.marcianos.me/v1/events/transfer/citizen",
      {
        method: "POST", // Add method - important!
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          operatorId: body.operatorId,
          operatorName: body.operatorName,
          transferUrl: body.transferUrl,
        }),
      }
    );

    console.log("Response status:", response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      return NextResponse.json(
        { error: `Error al transferir usuario ${errorText}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
        message: "Usuario transferido correctamente",
        status: response.status,
    });
  } catch (err) {
    console.error("Error deleting file:", err);
    return NextResponse.json(
      { error: `Error al transferir usuario ${err}` },
      { status: 500 }
    );
  }
}
