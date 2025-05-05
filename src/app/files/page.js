"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileCard } from "@/components/personalized/file"
import { Funnel } from "lucide-react";

export default function Page() {
    const [dropdownOpen, setDropdownOpen] = useState(false);


    return (
        <div style={{ backgroundColor: '#f5f5f5', height: '100vh', padding: '20px' }}>
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', justifyContent: 'center' }}>
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
            </header>
            <hr className='border-2 mb-4'></hr>
            <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            </main>

            
        </div>
    );
}