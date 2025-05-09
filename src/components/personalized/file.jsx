"use client";
import React, { useState } from "react";
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
  Download, // Add Download icon
} from "lucide-react";

const FileCard = React.memo(
  ({
    fileName,
    iconColor = "#666",
    fileType = "",
    authenticated = false,
    onFileDeleted,
  }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [signedUrl, setSignedUrl] = useState(null);
    const [loadingV, setLoadingV] = useState(false);
    const [loading, setLoading] = useState(false);
    const [veri, setVeri] = useState(false);
    // Add these new state variables
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

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

    const handleVerify = async () => {
      setLoadingV(true);
      try {
        const response = await fetch(`api/authenticate`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Asegúrate de incluir las cookies
          body: JSON.stringify({
            file_name: fileName,
            url_document: signedUrl,
          }),
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
    };

    const handleCardClick = async () => {
      if (isModalOpen) return; // Evita reabrir si ya está abierto

      setIsModalOpen(true);
      setLoading(true);
      setSelectedFile(fileName);

        try {
          const response = await fetch(`/api/preview?file_name=${fileName}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            setSignedUrl(data.signed_url);
          }
        } catch (error) {
          console.error("Error al obtener previsualización:", error);
        } finally {
          setLoading(false);
        }
    };

    const closeModal = (e) => {
      e?.stopPropagation();
      setSelectedFile(null);
      setIsModalOpen(false);
      setSignedUrl(null); // Limpia la URL al
      setIsHovered(false);
    };

    const renderModal = () => {
      if (!isModalOpen) return null;

      return (
        <div style={styles.modal}>
          <button onClick={closeModal} style={styles.closeButton}>
            &times;
          </button>
          <div style={styles.modalContent} className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Detalles del Archivo
            </h2>
            <div className="w-full bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="bg-white p-3 rounded shadow-sm">
                  <p className="text-sm font-medium text-gray-500">Nombre</p>
                  <p className="text-gray-800 font-semibold truncate">
                    {fileName}
                  </p>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <p className="text-sm font-medium text-gray-500">Tipo</p>
                  <p className="text-gray-800 font-semibold">
                    {fileType || "No disponible"}
                  </p>
                </div>
              </div>

              <div className="bg-white p-3 rounded shadow-sm">
                <p className="text-sm font-medium text-gray-500">Estado</p>
                <div
                  className={`font-semibold ${
                    authenticated ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {authenticated ? (
                    <span className="flex items-center gap-1">
                      <span>Autenticado</span>
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  ) : (
                    <div className="grid grid-cols-2">
                      <span className="flex items-center gap-1">
                        <span>No autenticado</span>
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span>
                        <Button
                          type="button"
                          className={
                            "float-end mr-4 bg-green-700 hover:bg-green-800"
                          }
                          disabled={loadingV || loading || !signedUrl}
                          onClick={handleVerify}
                        >
                          {loadingV ? "...Verificando" : "verificar"}
                        </Button>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {loading ? (
              <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-gray-50 rounded-lg">
                <div className="mb-4 p-3 bg-blue-100 rounded-full">
                  ...Cargando Previsualización
                </div>
              </div>
            ) : (
              renderPreview() // Usa tu función existente
            )}

            {/* Action Buttons */}
            <div style={styles.actions} className="mt-4">
              <div className="flex space-x-4">
                <button
                  onClick={handleDownloadFile}
                  disabled={loading || !signedUrl}
                  style={{
                    ...styles.downloadButton,
                    opacity: loading || !signedUrl ? 0.5 : 1,
                    cursor: loading || !signedUrl ? "not-allowed" : "pointer",
                  }}
                  data-download-button
                >
                  <Download size={18} className="mr-2" />
                  Descargar
                </button>

                <button
                  onClick={handleDeleteFile}
                  disabled={loading || deleteLoading || !selectedFile}
                  style={{
                    ...styles.deleteButton,
                    opacity:
                      loading || deleteLoading || !selectedFile ? 0.5 : 1,
                    cursor:
                      loading || deleteLoading || !selectedFile
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {deleteLoading ? (
                    <Loader2 size={18} className="mr-2 animate-spin" />
                  ) : (
                    <Trash2 size={18} className="mr-2" />
                  )}
                  Eliminar
                </button>
              </div>

              {deleteError && (
                <div style={styles.errorMessage}>{deleteError}</div>
              )}
            </div>
          </div>
        </div>
      );
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
        console.log("Deleting file:", selectedFile);
        const response = await fetch(`/api/delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ file_name: selectedFile }),
          credentials: "include", // Include cookies for authentication
        });

        console.log("Response:", response);

        if (response.ok) {
          // Close modal
          setSelectedFile(null);
          setSignedUrl(null);

          // Notify parent component about deletion (if callback provided)
          if (typeof onFileDeleted === "function") {
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

    const handleDownloadFile = async () => {
      if (!signedUrl || !selectedFile) return;

      try {
        // Show download is starting
        const downloadButton = document.querySelector("[data-download-button]");
        if (downloadButton) {
          downloadButton.innerHTML =
            '<span class="animate-pulse">Descargando...</span>';
        }

        // Instead of fetching directly from the signed URL, proxy through your backend
        const response = await fetch(
          `/api/download?file_name=${encodeURIComponent(
            selectedFile
          )}&signed_url=${encodeURIComponent(signedUrl)}`,
          {
            method: "GET",
            credentials: "include", // Include cookies for authentication
          }
        );

        if (!response.ok) {
          throw new Error(`Error downloading file: ${response.statusText}`);
        }

        // Get the blob from response
        const blob = await response.blob();

        // Create a blob URL for the file
        const blobUrl = URL.createObjectURL(blob);

        // Create a link element and trigger the download
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName || "downloaded-file"; // Use filename or default
        link.style.display = "none";
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Clean up
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
          document.body.removeChild(link);
          if (downloadButton) {
            downloadButton.innerHTML =
              '<span class="flex items-center"><Download size={18} className="mr-2" />Descargar</span>';
          }
        }, 100);
      } catch (error) {
        console.error("Error downloading file:", error);
        alert("Error al descargar el archivo. Por favor, inténtelo de nuevo.");

        // Reset the button state
        const downloadButton = document.querySelector("[data-download-button]");
        if (downloadButton) {
          downloadButton.innerHTML =
            '<span class="flex items-center"><Download size={18} className="mr-2" />Descargar</span>';
        }
      }
    };

    const renderPreview = () => {
      // Contenedor base para todos los previews
      const PreviewContainer = ({ children, icon: Icon }) => (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-gray-50 rounded-lg">
          {Icon && (
            <div className="mb-4 p-3 bg-blue-100 rounded-full">
              <Icon className="w-8 h-8 text-blue-600" />
            </div>
          )}
          <div className="w-full flex justify-center">{children}</div>
        </div>
      );

      if (loading) {
        return (
          <PreviewContainer icon={Loader2}>
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            <p className="mt-4 text-gray-600">Cargando vista previa...</p>
          </PreviewContainer>
        );
      }

      if (!signedUrl) {
        return (
          <PreviewContainer icon={File}>
            <div className="text-center">
              <p className="text-gray-600 font-medium">
                Vista previa no disponible
              </p>
              <p className="text-sm text-gray-500 mt-1">
                No se pudo cargar el archivo
              </p>
            </div>
          </PreviewContainer>
        );
      }

      if (fileType.includes("image")) {
        return (
          <PreviewContainer>
            <img
              src={signedUrl}
              alt={fileName}
              className="max-w-full max-h-[60vh] object-contain rounded-md shadow-sm"
            />
          </PreviewContainer>
        );
      }

      if (fileType.includes("pdf")) {
        return (
          <PreviewContainer>
            <iframe
              src={signedUrl}
              className="w-full h-[70vh] border border-gray-200 rounded-md"
              title={fileName}
            />
          </PreviewContainer>
        );
      }

      if (fileType.includes("video")) {
        return (
          <PreviewContainer>
            <video
              controls
              className="max-w-full max-h-[60vh] rounded-md shadow-sm"
            >
              <source src={signedUrl} type={fileType} />
              <p className="text-gray-500">Tu navegador no soporta videos</p>
            </video>
          </PreviewContainer>
        );
      }

      if (fileType.includes("audio")) {
        return (
          <PreviewContainer icon={Music}>
            <audio controls className="w-full max-w-md">
              <source src={signedUrl} type={fileType} />
              <p className="text-gray-500">Tu navegador no soporta audio</p>
            </audio>
          </PreviewContainer>
        );
      }

      return (
        <PreviewContainer icon={FileText}>
          <div className="text-center">
            <p className="text-gray-600 font-medium">
              Tipo de archivo no compatible
            </p>
            <p className="text-sm text-gray-500 mt-1">
              No podemos mostrar una vista previa de este tipo de archivo
            </p>
          </div>
        </PreviewContainer>
      );
    };

    const FileIcon = getFileIcon();

    return (
      <div
        style={styles.card}
        onClick={() => !isModalOpen && handleCardClick(fileName)}
        onMouseDown={(e) => e.preventDefault()} // Evita focos no deseados
      >
        <div
          style={styles.iconContainer}
          onMouseEnter={() => {
            !isModalOpen ? setIsHovered(true) : setIsHovered(false);
          }}
          onMouseLeave={() => {
            !isModalOpen ? setIsHovered(false) : setIsHovered(true);
          }}
        >
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
          className="truncate hover:bg-gray-500"
          style={{
            ...styles.label,
            backgroundColor: isHovered ? "#dcdcdc" : "#f8f8f8",
            cursor: "pointer",
          }}
        >
          {fileName}
        </div>
        {isModalOpen && renderModal()}
      </div>
    );
  }
);

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
    display: "flex",
  },
  actions: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  downloadButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6", // Blue color for download
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background-color 0.3s",
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
