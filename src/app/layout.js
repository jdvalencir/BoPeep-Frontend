import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Operador Marcianos",
  description: "Una plataforma intergaláctica para subir, organizar y compartir tus archivos personales con seguridad extrema.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" nighteye="disabled">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        cz-shortcut-listen="true">
        <div className="h-screen">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
