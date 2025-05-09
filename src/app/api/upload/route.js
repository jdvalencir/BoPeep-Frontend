import { NextResponse } from 'next/server';

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
    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Create a new FormData object to send to the external API
    const apiFormData = new FormData();
    apiFormData.append('file', file);

    // Make the API call to the external service
    const response = await fetch('http://localhost:8000/v1/documents/uploadDocument', {
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Include the access token in the headers
        // 'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      body: apiFormData,
      // Add any required headers for the API
      // headers: {
      //   'Authorization': 'Bearer YOUR_API_TOKEN' // Include if API requires authentication
      // }
    });

    // Parse the API response
    const result = await response.json();

    // Check if the API call was successful
    if (!response.ok) {
      throw new Error(result.message || 'Error from external API');
    }

    // Return the API response to the client
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', message: error.message },
      { status: 500 }
    );
  }
}