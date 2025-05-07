"use client"
import React, { useState, useRef } from 'react';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileCard } from "@/components/personalized/file"
import { Upload, FileSearch, Loader2, CheckCircle, XCircle, ArrowLeft, Router, Funnel  } from "lucide-react";
import FileUploader from "@/components/uploadFiles/page"
export default function Page() {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [items, setItems] = useState(['a']); // Estado inicial: array vacío

    const [addFile, setAddFile] = useState(false)
    // Función para el botón de regresar
    const handleGoBack = () => {
        router.push('/home')
        setAddFile(false)
    // Aquí puedes agregar tu lógica de navegación (ej: router.back() en Next.js)
    };
    return (
        
        <div>
            {!items || items.length === 0 ? 
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
                <FileUploader/>
            </div>
            :
            // inicio de cuando hay archivos
            !addFile ? 
                    <div style={{ backgroundColor: '#f5f5f5', height: '100vh', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', justifyContent: 'center' }}>
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <div style={{ position: 'relative' }}>
                                <Button onClick={() => setDropdownOpen(!dropdownOpen)}><Funnel /></Button>
                                {dropdownOpen && (
                                    <div style={{ 
                                        position: 'absolute', 
                                        top: '0%', 
                                        right: '100%', 
                                        border: '1px solid #ccc', 
                                        borderRadius: '4px', 
                                        padding: '10px', 
                                        zIndex: 1000, 
                                        display: 'grid', 
                                        gridTemplateColumns: 'repeat(2, 1fr)', 
                                        gap: '10px', 
                                        width: '200px' 
                                    }} className='bg-gray-200'>
                                        <label style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} className='bg-white'>
                                            <input type="checkbox" /> Filtro
                                        </label>
                                        <label style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} className='bg-white'>
                                            <input type="checkbox" /> Filtro
                                        </label>
                                        <label style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} className='bg-white'>
                                            <input type="checkbox" /> Filtro
                                        </label>
                                        <label style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} className='bg-white'>
                                            <input type="checkbox" /> Filtro
                                        </label>
                                    </div>
                                )}
                            </div>
                            <Input type="email" placeholder="Busqueda por palabras clave" />
                            <Button type="submit">Buscar</Button>
                        </div>
                        <div className='ml-4'> 
                            <Button onClick={()=>{setAddFile(true)}} className={'bg-green-700 hover:bg-green-800'}>Subir</Button>
                        </div>
                    </div>
                    <hr className='border-2 mb-4'></hr>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(3, 1fr)', 
                            gap: '20px', 
                            justifyContent: 'center' 
                        }}>
                            <FileCard iconColor='f14747' fileName="Archivo 1"/>
                            <FileCard iconColor='48a8e4' fileName="Archivo 2"/>
                            <FileCard iconColor='f2803d' fileName="Archivo 3"/>
                        </div>
                    </div>    
                </div>                                
                :
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
                <FileUploader/>
            </div>        
                
            }
            
        </div>
    );
}