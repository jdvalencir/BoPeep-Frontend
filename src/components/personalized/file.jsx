"use client";
import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const FileCard = ({ fileName, iconColor = "#666" }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleCardClick = (fileName) => {
        setSelectedFile(fileName);
    };

    const closeModal = (e) => {
        e.stopPropagation();
        console.log("Modal closed");
        setSelectedFile(null);
    };

    return (
        <div
            style={styles.card}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => handleCardClick(fileName)}
        >
            <FileText
                size="90%"
                style={{
                    margin: "5%",
                    color: iconColor,
                    width: "90%",
                    height: "90%",
                }}
            />
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
                <div
                    style={{
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
                    }}
                >
                    <button
                        onClick={(e) => { closeModal(e); setIsHovered(false); }}
                        style={{
                            position: "absolute",
                            top: "20px",
                            right: "20px",
                            background: "none",
                            border: "none",
                            fontSize: "24px",
                            color: "white",
                            cursor: "pointer",
                        }}
                    >
                        &times;
                    </button>
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "20px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                            textAlign: "center",
                            width: "60%",
                            height: "90%",
                            overflowY: "auto",
                        }}
                    >
                        <h2>Detalles del Archivo</h2>
                        <p>Has seleccionado:{selectedFile}</p>
                        <p>pa la pre visualizacion</p>
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
    label: {
        padding: "10px",
        fontSize: "14px",
        fontWeight: "bold",
        color: "#333",
        width: "100%",
        textAlign: "center",
        transition: "background-color 0.3s ease",
    },
};

export { FileCard };