import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Get the file name from query params
    const url = new URL(req.url);
    const fileName = url.searchParams.get("file_name");
    const signedUrl = url.searchParams.get("signed_url");

    console.log("Signed URL:", signedUrl);
    console.log("File Name:", fileName);

    if (!fileName) {
      return NextResponse.json(
        { error: "Nombre de archivo requerido" },
        { status: 400 }
      );
    }

    if (!signedUrl) {
      return NextResponse.json(
        { error: "URL del archivo no disponible" },
        { status: 404 }
      );
    }



    // Now fetch the actual file content from the signed URL
    const fileResponse = await fetch(signedUrl);
    
    if (!fileResponse.ok) {
      return NextResponse.json(
        { error: "Error al descargar el archivo" },
        { status: fileResponse.status }
      );
    }

    // Get file content as array buffer
    const fileBuffer = await fileResponse.arrayBuffer();
    
    // Create response with appropriate headers for download
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': fileResponse.headers.get('Content-Type') || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileResponse.headers.get('Content-Length') || String(fileBuffer.byteLength),
      },
    });
    
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Error al procesar la descarga" },
      { status: 500 }
    );
  }
}