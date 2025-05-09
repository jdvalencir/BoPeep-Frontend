'use client'
import { Upload, FileSearch, Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import React, { useState, useRef } from 'react';

const FileUploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error' | null
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setUploadStatus(null);
        }
    };

    // Simulación de llamada API
    const simulateUpload = async () => {
        try {
            setIsUploading(true);
            setUploadStatus(null);
            const formData = new FormData();
            // Aquí puedes agregar la lógica para subir el archivo a tu API
            formData.append("file", selectedFile);
            const response = await fetch("/api/upload", { 
                method: "POST",
                body: formData,
                credentials: "include", // Asegúrate de incluir las cookies
            });

            if (!response.ok) {
                throw new Error("Error en la subida del archivo");
            }

            const data = await response.json();
            setUploadStatus("success");
        } catch (error) {
            setUploadStatus("error");
            console.error("Error al subir el archivo:", error);
        } finally {
            setIsUploading(false);
        }

    };

    const handleNewFile = () => {
        setSelectedFile(null);
        setUploadStatus(null);
        fileInputRef.current.value = ''; // Limpiar input file
    };

    
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="mt-10 flex flex-col items-center justify-center text-center">
            {/* Icono con estados */}
            {uploadStatus === "success" ? (
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" strokeWidth={1.5} />
            ) : uploadStatus === "error" ? (
                <XCircle className="w-16 h-16 text-red-500 mb-4" strokeWidth={1.5} />
            ) : (
                <FileSearch className={`w-16 h-16 mb-4 ${selectedFile ? "text-blue-500" : "text-gray-400"}`} strokeWidth={1.5} />
            )}

            {/* Texto dinámico */}
            <p className="text-gray-600 text-lg mb-6">
                {isUploading
                    ? `Subiendo archivo: ${selectedFile?.name}`
                    : uploadStatus === "success"
                    ? `¡${selectedFile?.name} subido con éxito!`
                    : uploadStatus === "error"
                    ? `Error al subir ${selectedFile?.name}. Intenta nuevamente.`
                    : selectedFile
                    ? `Archivo seleccionado: ${selectedFile.name}`
                    : "No hay archivos que mostrar"}
            </p>

            {/* Input oculto */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
            />

            {/* Botones */}
            <div className="flex gap-4">
                {!uploadStatus ? (
                    <>
                        <button
                            onClick={triggerFileInput}
                            disabled={isUploading}
                            className="flex items-center gap-2 font-medium py-2 px-6 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors shadow-sm"
                        >
                            <Upload className="w-5 h-5" />
                            {selectedFile ? "Cambiar archivo" : "Seleccionar archivo"}
                        </button>
                        
                        {selectedFile && (
                            <button
                                onClick={simulateUpload}
                                disabled={isUploading}
                                className="flex items-center gap-2 font-medium py-2 px-6 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Subiendo...
                                    </>
                                ) : (
                                    "Subir archivo"
                                )}
                            </button>
                        )}
                    </>
                ) : (
                    <button
                        onClick={handleNewFile}
                        className="flex items-center gap-2 font-medium py-2 px-6 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm"
                    >
                        <Upload className="w-5 h-5" />
                        Subir otro archivo
                    </button>
                )}
            </div>

            {/* Mensaje adicional */}
            {!isUploading && !uploadStatus && (
                <p className="text-gray-400 text-sm mt-3">
                    Formatos soportados: PDF, DOC, XLS (Max. 5MB)
                </p>
            )}
        </div>
    );
};

export default FileUploader;