"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  FileText,
  Image,
  FileVideo,
  Music,
  FileCode,
  FilePen,
  Lock,
  Unlock,
  File,
  Loader2,
  Trash2,
} from "lucide-react";

const FileCard = ({
  fileName,
  iconColor = "#666",
  fileType = "",
  authenticated = false,
  onFileDeleted,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [signedUrl, setSignedUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [loadingV, setLoadingV] = useState(false);
  const [veri, setVeri] = useState(false);


  const getFileIcon = () => {
    if (!fileType) return <File />;

    if (fileType.includes("image")) return <Image />;
    if (fileType.includes("pdf")) return <FilePen />;
    if (fileType.includes("video")) return <FileVideo />;
    if (fileType.includes("audio")) return <Music />;
    if (fileType.includes("text") || fileType.includes("application/json"))
      return <FileCode />;

    return <FileText />;
  };

  const isPreviewable = (fileType) => {
    return (
      fileType &&
      (fileType.includes("image") ||
        fileType.includes("pdf") ||
        fileType.includes("video") ||
        fileType.includes("audio"))
    );
  };
  const handleVerify = async() =>{
    setLoadingV(true);
    try {
      const response = await fetch(`aca va la llamada de la api`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Asegúrate de incluir las cookies
      });
      if (response.ok) {
        const data = await response.json();
        console.log("archivo verificado:", data);
        setVeri(data);
      }
    } catch (error) {
      console.error("Error en la verificación:", error);
    } finally {
      setLoadingV(false);
    }
  }
  const handleCardClick = async (fileName) => {
    setSelectedFile(fileName);

    if (isPreviewable(fileType)) {
      setLoading(true);
      try {
        const response = await fetch(`/api/preview?file_name=${fileName}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Asegúrate de incluir las cookies
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Signed URL:", data.signed_url);
          setSignedUrl(data.signed_url);
        }
      } catch (error) {
        console.error("Error fetching signed URL:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const closeModal = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setSignedUrl(null);
  };

  const handleDeleteFile = async (e) => {
    e.stopPropagation();
    
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete ${selectedFile}?`)) {
      return;
    }
    
    setDeleteLoading(true);
    setDeleteError(null);
    
    try {
      const response = await fetch(`/api/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_name: selectedFile }),
        credentials: "include", // Include cookies for authentication
      });
      
      if (response.ok) {
        // Close modal
        setSelectedFile(null);
        setSignedUrl(null);
        
        // Notify parent component about deletion (if callback provided)
        if (typeof onFileDeleted === 'function') {
          onFileDeleted(fileName);
        }
      } else {
        const errorData = await response.json();
        setDeleteError(errorData.message || "Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setDeleteError("Network error when trying to delete file");
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderPreview = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center w-full">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="mt-4">Cargando Preview...</p>
        </div>
      );
    }

    if (!signedUrl) {
      return <div>Preview not available</div>;
    }

    if (fileType.includes("image")) {
      return (
        <img
          src={signedUrl}
          alt={fileName}
          style={{ maxWidth: "100%", maxHeight: "50vh" }}
        />
      );
    }

    if (fileType.includes("pdf")) {
      return (
        <iframe
          src={signedUrl}
          style={{ width: "100%", height: "70vh" }}
          title={fileName}
        />
      );
    }

    if (fileType.includes("video")) {
      return (
        <video controls style={{ maxWidth: "100%", maxHeight: "50vh" }}>
          <source src={signedUrl} type={fileType} />
          Your browser does not support video playback.
        </video>
      );
    }

    if (fileType.includes("audio")) {
      return (
        <audio controls style={{ width: "100%" }}>
          <source src={signedUrl} type={fileType} />
          Your browser does not support audio playback.
        </audio>
      );
    }

    return <div>Preview not supported for this file type</div>;
  };

  const FileIcon = getFileIcon();

  return (
    <div
      style={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => handleCardClick(fileName)}
    >
      <div style={styles.iconContainer}>
        {React.cloneElement(FileIcon, {
          size: "90%",
          style: {
            margin: "5%",
            color: `#${iconColor}`,
            width: "90%",
            height: "90%",
          },
        })}
        {authenticated ? (
          <Lock size={18} style={styles.authIcon} color="#10b981" />
        ) : (
          <Unlock size={18} style={styles.authIcon} color="#ef4444" />
        )}
      </div>
      <div
      className="truncate"
        style={{
          ...styles.label,
          backgroundColor: isHovered ? "#dcdcdc" : "#f8f8f8",
          cursor: isHovered ? "pointer" : "default",
        }}
      >
        {fileName}
      </div>

      {selectedFile && (
        <div style={styles.modal}>
          <button onClick={closeModal} style={styles.closeButton}>
            &times;
          </button>
          <div style={styles.modalContent} className="flex flex-col items-center gap-4 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Detalles del Archivo</h2>
            
            <div className="w-full bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="bg-white p-3 rounded shadow-sm">
                  <p className="text-sm font-medium text-gray-500">Nombre</p>
                  <p className="text-gray-800 font-semibold truncate">{selectedFile}</p>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <p className="text-sm font-medium text-gray-500">Tipo</p>
                  <p className="text-gray-800 font-semibold">{fileType || "No disponible"}</p>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded shadow-sm">
                <p className="text-sm font-medium text-gray-500">Estado</p>
                <p className={`font-semibold ${authenticated ? 'text-green-600' : 'text-red-600'}`}>
                  {authenticated ? (
                    <span className="flex items-center gap-1">
                      <span>Autenticado</span>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                  ) : (
                    <div className="grid grid-cols-2">
                      <span className="flex items-center gap-1">
                        <span>No autenticado</span>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                      </span>
                      <span>              
                        <Button 
                        type="button"
                        className={'float-end mr-4 bg-green-700 hover:bg-green-800'}
                        disabled={loadingV}
                        >
                          {loadingV ? "...Verificando" : "verificar"}
                        </Button>
                      </span>                      
                    </div>                                                          
                  )}
                </p>
              </div>
            </div>

            <div className="w-full bg-gray-50 rounded-lg p-4 flex flex-col items-center">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Vista Previa</h3>
              <div className="w-full min-h-[200px] max-h-[400px] flex items-center justify-center bg-white rounded border border-gray-200 p-4 overflow-auto">
                {isPreviewable(fileType) ? (
                  renderPreview()
                ) : (
                  <div className="text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-2">Vista previa no disponible</p>
                    <p className="text-sm">Este tipo de archivo no puede mostrarse</p>
                  </div>
                )}
              </div>
            </div>
            
            <div style={styles.actions}>
              <button 
                onClick={handleDeleteFile} 
                style={styles.deleteButton}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                {deleteLoading ? "Deleting..." : "Delete File"}
              </button>
              {deleteError && (
                <p style={styles.errorMessage}>{deleteError}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    overflow: "hidden",
    width: "200px",
    height: "200px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ececec",
  },
  iconContainer: {
    position: "relative",
    width: "100%",
    height: "80%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  authIcon: {
    position: "absolute",
    bottom: "5px",
    right: "5px",
    background: "white",
    borderRadius: "50%",
    padding: "2px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  label: {
    padding: "10px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
    width: "100%",
    height: "20%",
    textAlign: "center",
    transition: "background-color 0.3s ease",

  },
  modal: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    flexDirection: "column",
  },
  closeButton: {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "white",
    cursor: "pointer",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    textAlign: "left",
    width: "90%",
    height: "90%",
    overflowY: "auto",
    display: 'flex',
  },
  actions: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  deleteButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },
  errorMessage: {
    color: "#ef4444",
    marginTop: "8px",
    fontSize: "14px",
  },
};

export { FileCard };
