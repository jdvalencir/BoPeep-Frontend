"use client";
import React, { useState, useEffect } from "react";
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
} from "lucide-react";

const FileCard = ({
  fileName,
  iconColor = "#666",
  fileType = "",
  authenticated = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [signedUrl, setSignedUrl] = useState(null);
  const [loading, setLoading] = useState(false);

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
          <div style={styles.modalContent}>
            <h2 style={{ marginBottom: "20px" }}>Detalles del Archivo</h2>
            <p>
              <strong>Nombre:</strong> {selectedFile}
            </p>
            <p>
              <strong>Tipo:</strong> {fileType || "No disponible"}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              {authenticated ? "Autenticado ✓" : "No autenticado ✗"}
            </p>

            <div className="w-full mt-4 flex justify-center items-center">
              {isPreviewable(fileType) ? (
                renderPreview()
              ) : (
                <p>Vista previa no disponible para este tipo de archivo</p>
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
    width: "70%",
    height: "80%",
    overflowY: "auto",
  },
};

export { FileCard };
