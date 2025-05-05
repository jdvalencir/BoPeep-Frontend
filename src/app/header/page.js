'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {SidebarTrigger } from "@/components/ui/sidebar"


const Header = () => {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const goToHome = () => {
        router.push('/main');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div style={styles.header}>
            <div className='mx-2'>
                Bienvenido a la aplicación
            </div>
            <div style={styles.profileContainer}>
                <Avatar onClick={toggleDropdown} style={{...styles.avatar, '!important': true}}>
                    <AvatarImage src="/src/app/images/profile.gif" alt="Profile" />
                </Avatar>
                {dropdownOpen && (
                    <div style={styles.dropdownMenu} className='bg-gray-200'>
                        <button className='bg-gray-200' style={styles.dropdownItem} onClick={() => router.push('/profile')}>Perfil</button>
                        <button className='bg-gray-200' style={styles.dropdownItem} onClick={() => router.push('/settings')}>Configuración</button>
                        <button className='bg-gray-200' style={styles.dropdownItem} onClick={() => router.push('/logout')}>Cerrar Sesión</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 15px',
    },
    button: {
        padding: '8px 16px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#6c757d',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
    },
    profileContainer: {
        position: 'relative',
        backgroundColor: '#464141',
        borderRadius: '50%',
    },
    avatar: {
        cursor: 'pointer',
        width: '40px',
        height: '40px',
    },
    dropdownMenu: {
        position: 'absolute',
        top: '50px',
        right: '0',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: 'none',
        overflow: 'hidden',
        zIndex: 1000,
    },
    dropdownItem: {
        padding: '10px 20px',
        fontSize: '14px',
        cursor: 'pointer',
        border: 'none',
        textAlign: 'left',
        width: '100%',
    },
};

export default Header;