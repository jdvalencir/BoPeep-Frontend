"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileCard } from "@/components/personalized/file";
import {
  Upload,
  FileSearch,
  Loader2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Router,
  Funnel,
} from "lucide-react";
import FileUploader from "@/components/uploadFiles/page";
export default function Page() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [addFile, setAddFile] = useState(false);
  // Función para el botón de regresar
  const handleGoBack = () => {
    router.push("/home");
    setAddFile(false);
    // Aquí puedes agregar tu lógica de navegación (ej: router.back() en Next.js)
  };

  // Add this helper function after your useState declarations
  const getIconColorByFileType = (fileType) => {
    if (!fileType) return "808080"; // Default gray

    // Map file types to colors
    if (fileType.includes("image")) return "3b82f6"; // Blue for images
    if (fileType.includes("pdf")) return "ef4444"; // Red for PDFs
    if (fileType.includes("video")) return "f97316"; // Orange for videos
    if (fileType.includes("audio")) return "8b5cf6"; // Purple for audio
    if (fileType.includes("text")) return "10b981"; // Green for text
    if (fileType.includes("application")) return "6366f1"; // Indigo for applications

    return "64748b"; // Slate gray default
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/documents", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Asegúrate de incluir las cookies
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Documentos:", data);
        setDocuments(data.documents);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []); // Llama a la función al cargar el componente

  if (loading) {
        return (
          <div className="flex flex-col items-center justify-center w-full min-h-[80vh]">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="mt-4">Cargando archivos...</p>
          </div>
        );
      }

  return (
    <div>
      {!documents || documents.length === 0 ? (
        <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-5 text-center relative">
          {/* Botón de regresar (esquina superior izquierda) */}
          <button
            onClick={()=> router.push('/home')}
            className="absolute top-5 left-5 flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Regresar</span>
          </button>

          {/* Contenido principal */}
          <FileUploader />
        </div>
      ) : // inicio de cuando hay archivos
      !addFile ? (
        <div
          style={{
            backgroundColor: "#f5f5f5",
            height: "100vh",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              justifyContent: "center",
            }}
          >
            <div className="flex w-full max-w-sm items-center space-x-2">
              <div style={{ position: "relative" }}>
                <Button onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <Funnel />
                </Button>
                {dropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "0%",
                      right: "100%",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "10px",
                      zIndex: 1000,
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "10px",
                      width: "200px",
                    }}
                    className="bg-gray-200"
                  >
                    <label
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      }}
                      className="bg-white"
                    >
                      <input type="checkbox" /> Filtro
                    </label>
                    <label
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      }}
                      className="bg-white"
                    >
                      <input type="checkbox" /> Filtro
                    </label>
                    <label
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      }}
                      className="bg-white"
                    >
                      <input type="checkbox" /> Filtro
                    </label>
                    <label
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      }}
                      className="bg-white"
                    >
                      <input type="checkbox" /> Filtro
                    </label>
                  </div>
                )}
              </div>
              <Input type="email" placeholder="Busqueda por palabras clave" />
              <Button type="submit">Buscar</Button>
            </div>
            <div className="ml-4">
              <Button
                onClick={() => {
                  setAddFile(true);
                }}
                className={"bg-green-700 hover:bg-green-800"}
              >
                Subir
              </Button>
            </div>
          </div>
          <hr className="border-2 mb-4"></hr>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                justifyContent: "center",
              }}
            >
              {documents.map((item) => (
                <div
                  key={item.id}
                  style={{
                    width: "200px",
                    height: "200px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    padding: "10px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <FileCard
                    iconColor={getIconColorByFileType(item.type)}
                    fileName={item.file_name}
                    authenticated={item.authenticated}
                    fileType={item.type}
                  />
                </div>
              ))
              }
              {/* Ejemplo de FileCard */}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-5 text-center relative">
          {/* Botón de regresar (esquina superior izquierda) */}
          <button
            onClick={handleGoBack}
            className="absolute top-5 left-5 flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Regresar</span>
          </button>

          {/* Contenido principal */}
          <FileUploader />
        </div>
      )}
    </div>
  );
}
