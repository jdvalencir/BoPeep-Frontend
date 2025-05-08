'use client'
import { Upload, FileSearch, Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import React, { useState, useRef } from 'react';

const FileUploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error' | null
    const [fileName, setFileName] = useState(''); // Nuevo estado para el nombre del archivo
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name); // Guardamos el nombre del archivo
            setUploadStatus(null); // Resetear estado anterior
            simulateUpload(file); // Simular subida
        }
    };

    // Simulación de llamada API
    const simulateUpload = (file) => {
        setIsUploading(true);
        
        // Simulamos un retraso de 2 segundos (como una API real)
        setTimeout(() => {
            setIsUploading(false);
            
            // Simulamos un 80% de éxito y 20% de error (para pruebas)
            const isSuccess = Math.random() > 0.2;
            
            if (isSuccess) {
                setUploadStatus("success");
                console.log("Archivo subido:", file.name);
            } else {
                setUploadStatus("error");
                console.error("Error al subir el archivo");
            }
        }, 100);
    };

    const handleButtonClick = () => {
        if (uploadStatus === "success") {
            setUploadStatus(null);
            setSelectedFile(null);
            setFileName(null);
            setSelectedFile(null)
            setIsUploading(false)
        }
        fileInputRef.current.click();
    };

    return(
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
                ? `Subiendo archivo: ${fileName}` // Mostramos el nombre del archivo durante la subida
                : uploadStatus === "success"
                ? `¡${fileName} subido con éxito!` // Mostramos el nombre en el mensaje de éxito
                : uploadStatus === "error"
                ? `Error al subir ${fileName}. Intenta nuevamente.` // Mostramos el nombre en el error
                : selectedFile
                ? `Archivo seleccionado: ${fileName}`
                : "No hay archivos que mostrar"}
            </p>
    
            {/* Input oculto */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
                key={uploadStatus} // Forzar recreación del input al cambiar estado
            />
    
            {/* Botón principal */}
            <button
                onClick={handleButtonClick}
                disabled={isUploading}
                className={`flex items-center gap-2 font-medium py-2 px-6 rounded-md transition-colors shadow-sm ${
                isUploading
                    ? "bg-gray-300 text-gray-500 cursor-wait"
                    : uploadStatus === "success"
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : uploadStatus === "error"
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow"
                }`}
            >
                {isUploading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Procesando...
                </>
                ) : uploadStatus === "success" ? (
                <>
                    <Upload className="w-5 h-5" />
                    Subir otro archivo                    
                </>
                ) : uploadStatus === "error" ? (
                <>
                    <XCircle className="w-5 h-5" />
                    Reintentar
                </>
                ) : (
                <>
                    <Upload className="w-5 h-5" />
                    {selectedFile ? "Cambiar archivo" : "Subir un archivo"}
                </>
                )
                }
            </button>
    
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