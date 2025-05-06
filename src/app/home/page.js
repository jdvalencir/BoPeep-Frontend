'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
    const router = useRouter();

    const handleClick = (Pagina) => {
        router.push(`/${Pagina}`); // Redirige a la página de login
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',  }}>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
                <button 
                    type="submit" 
                    onClick={() => handleClick('login')}
                    style={{ backgroundColor: 'white', color: 'black', padding: '10px 20px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Login
                </button>
                <button 
                    type="button" 
                    onClick={() => handleClick('register')} 
                    style={{ backgroundColor: 'white', color: 'black', padding: '10px 20px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Register
                </button>
            </div>
        </div>
    );
};

export default LandingPage;