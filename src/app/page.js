"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const LandingPage = () => {
  const router = useRouter();

  const handleClick = (page) => {
    router.push(`/${page}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans">
      {/* Hero */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-br from-gray-900 to-black">
        <h1 className="text-6xl font-extrabold mb-4">Operador Marcianos 👽</h1>
        <p className="text-xl max-w-2xl mb-8">
          Una plataforma intergaláctica para subir, organizar y compartir tus
          archivos personales con seguridad extrema.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => handleClick("auth/login")}
            className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 font-semibold"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => handleClick("auth/register")}
            className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-black font-semibold"
          >
            Registrarse
          </button>
        </div>
      </section>

      {/* Sección 1: Acceso */}
      <section className="min-h-[80vh] bg-gray-900 py-20 flex flex-col justify-center items-center">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-6">
              🔍 Accede desde cualquier parte del universo
            </h2>
            <p className="text-lg max-w-4xl mb-6">
              Accede a todos tus archivos sin importar dónde estés. Nuestra nube
              planetaria es rápida, segura y siempre disponible.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base max-w-3xl">
              <li>Compatibilidad total con móviles, tablets y computadoras.</li>
              <li>
                Historial de versiones: nunca pierdes cambios importantes.
              </li>
              <li>Vista previa para imágenes, videos, PDF y más.</li>
            </ul>
            <p className="mt-6 text-base text-gray-400 max-w-3xl">
              Imagina estar en otro continente (o planeta) y poder presentar un
              documento importante al instante. Esa es la promesa de Operador
              Marcianos.
            </p>
          </div>
          <div className="flex-1">
            <Image
              width={500}
              height={500}
              src="/images/alien-bttv.gif"
              alt="Alien Bailando"
              className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Sección 2: Seguridad */}
      <section className="min-h-[80vh] bg-gray-800 py-20 flex flex-col justify-center items-center">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1 hidden md:block">
            <Image
              width={500}
              height={500}
              src="/images/profile.gif"
              alt="GIF Perfil"
              className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-6">
              🔐 Seguridad de otro mundo
            </h2>
            <p className="text-lg max-w-4xl mb-6">
              Tus archivos están protegidos con cifrado AES-256 y protocolos
              interplanetarios. Tú decides quién puede acceder y cuándo.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base max-w-3xl">
              <li>
                Control de acceso granular: usuarios, operadores y grupos
                personalizados.
              </li>
              <li>
                Alertas de actividad sospechosa y autenticación multifactor
                (MFA).
              </li>
              <li>Caducidad de enlaces compartidos y auditoría completa.</li>
            </ul>
            <div className="mt-8">
              <button
                onClick={() => handleClick("auth/register")}
                className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 font-semibold"
              >
                Comienza a proteger tus archivos
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-center py-6 text-sm text-gray-400">
        © 2025 Operador Marcianos. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default LandingPage;
