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
  
  // New state variables for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    fileTypes: {
      pdf: false,
      image: false,
      video: false,
      document: false,
      other: false
    },
    authenticated: {
      authenticated: false,
      notAuthenticated: false
    }
  });

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
  const MemoizedFileCard = React.memo(FileCard, (prevProps, nextProps) => {
    return (
      prevProps.fileName === nextProps.fileName &&
      prevProps.fileType === nextProps.fileType &&
      prevProps.authenticated === nextProps.authenticated &&
      prevProps.iconColor === nextProps.iconColor
    );
  });

  // Add these functions after your existing helper functions

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form submission
    // The search is already handled by the filtering function
  };

  // Handle filter changes
  const handleFilterChange = (category, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [category]: {
        ...prevFilters[category],
        [value]: !prevFilters[category][value]
      }
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      fileTypes: {
        pdf: false,
        image: false,
        video: false,
        document: false,
        other: false
      },
      authenticated: {
        authenticated: false,
        notAuthenticated: false
      }
    });
    setSearchTerm("");
  };

  // Filter documents based on search term and selected filters
  const getFilteredDocuments = () => {
    if (!documents) return [];

    return documents.filter(doc => {
      // Filter by search term
      if (searchTerm && !doc.file_name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Check if any file type filters are selected
      const anyFileTypeSelected = Object.values(filters.fileTypes).some(value => value);
      
      if (anyFileTypeSelected) {
        const docType = doc.type.toLowerCase();
        
        // Check if document matches any selected file type
        if (
          (filters.fileTypes.pdf && docType.includes("pdf")) ||
          (filters.fileTypes.image && docType.includes("image")) ||
          (filters.fileTypes.video && docType.includes("video")) ||
          (filters.fileTypes.document && (
            docType.includes("document") || 
            docType.includes("word") || 
            docType.includes("openxmlformats-officedocument.word")
          )) ||
          (filters.fileTypes.other && 
            !docType.includes("pdf") && 
            !docType.includes("image") && 
            !docType.includes("video") && 
            !docType.includes("document") && 
            !docType.includes("word"))
        ) {
          // Document passes file type filter
        } else {
          return false;
        }
      }

      // Check if any authentication filters are selected
      const anyAuthSelected = Object.values(filters.authenticated).some(value => value);
      
      if (anyAuthSelected) {
        if (
          (filters.authenticated.authenticated && doc.authenticated) ||
          (filters.authenticated.notAuthenticated && !doc.authenticated)
        ) {
          // Document passes authentication filter
        } else {
          return false;
        }
      }

      return true;
    });
  };

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
      setDocuments(data.documents);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []); // Llama a la función al cargar el componente

  const onRefresh = () => {
    setDocuments([]);
    fetchItems();
  };

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
            onClick={() => router.push("/home")}
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
                      padding: "15px",
                      zIndex: 1000,
                      width: "350px",
                    }}
                    className="bg-gray-200"
                  >
                    <h4 className="font-bold mb-2">Tipo de archivo</h4>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <label className="bg-white p-2 rounded flex items-center">
                        <input 
                          type="checkbox" 
                          checked={filters.fileTypes.pdf} 
                          onChange={() => handleFilterChange('fileTypes', 'pdf')}
                          className="mr-2"
                        /> 
                        PDF
                      </label>
                      <label className="bg-white p-2 rounded flex items-center">
                        <input 
                          type="checkbox" 
                          checked={filters.fileTypes.image} 
                          onChange={() => handleFilterChange('fileTypes', 'image')}
                          className="mr-2"
                        /> 
                        Imágenes
                      </label>
                      <label className="bg-white p-2 rounded flex items-center">
                        <input 
                          type="checkbox" 
                          checked={filters.fileTypes.video} 
                          onChange={() => handleFilterChange('fileTypes', 'video')}
                          className="mr-2"
                        /> 
                        Videos
                      </label>
                      <label className="bg-white p-2 rounded flex items-center">
                        <input 
                          type="checkbox" 
                          checked={filters.fileTypes.document} 
                          onChange={() => handleFilterChange('fileTypes', 'document')}
                          className="mr-2"
                        /> 
                        Documentos
                      </label>
                      <label className="bg-white p-2 rounded flex items-center">
                        <input 
                          type="checkbox" 
                          checked={filters.fileTypes.other} 
                          onChange={() => handleFilterChange('fileTypes', 'other')}
                          className="mr-2"
                        /> 
                        Otros
                      </label>
                    </div>
                    
                    <h4 className="font-bold mb-2">Estado</h4>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <label className="bg-white p-2 rounded flex items-center">
                        <input 
                          type="checkbox" 
                          checked={filters.authenticated.authenticated} 
                          onChange={() => handleFilterChange('authenticated', 'authenticated')}
                          className="mr-2"
                        /> 
                        Autenticado
                      </label>
                      <label className="bg-white p-2 rounded flex items-center">
                        <input 
                          type="checkbox" 
                          checked={filters.authenticated.notAuthenticated} 
                          onChange={() => handleFilterChange('authenticated', 'notAuthenticated')}
                          className="mr-2"
                        /> 
                        No autenticado
                      </label>
                    </div>
                    
                    <Button 
                      onClick={resetFilters} 
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      Limpiar filtros
                    </Button>
                  </div>
                )}
              </div>
              <form onSubmit={handleSearch} className="flex flex-1">
                <Input 
                  type="text" 
                  placeholder="Búsqueda por palabras clave"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="flex-1"
                />
              </form>
            </div>
            <div className="ml-4">
              <Button
                onClick={() => {
                  setAddFile(true);
                }}
                className={"bg-green-700 hover:bg-green-800"}
              >
                Subir Archivo
              </Button>
            </div>
            <div>
              <Button
                onClick={onRefresh}
                className={"bg-blue-700 hover:bg-blue-800 ml-4"}
              >
                Actualizar
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
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
                justifyContent: "center",
              }}
            >
              {getFilteredDocuments().length > 0 ? (
                getFilteredDocuments().map((item) => (
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
                    <div>
                      <MemoizedFileCard
                        key={item.id}
                        fileName={item.file_name}
                        fileType={item.type}
                        authenticated={item.authenticated}
                        iconColor={getIconColorByFileType(item.type)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-4 text-center py-10">
                  <FileSearch className="mx-auto w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-gray-500">No se encontraron documentos con los filtros actuales</p>
                </div>
              )}
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
