import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import "./phone.css";

export const metadata: Metadata = {
  title: "iMessage Draft Simulator",
  description: "Buat draft chat iMessage: atur kontak, foto profil, wallpaper, reply, reaction, lalu lihat dan screenshot preview chat.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
