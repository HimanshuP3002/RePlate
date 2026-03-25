import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "RePlate",
  description: "Smart food waste-to-value MVP for Nagpur.",
  icons: {
    icon: "/replate-logo.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <div className="ambientGlow ambientGlowOne" />
          <div className="ambientGlow ambientGlowTwo" />
          <div className="page">
            <header className="topbar">
              <Link href="/" className="brand">
                <span className="brandMark brandLogo">
                  <Image src="/replate-logo.svg" alt="RePlate logo" width={44} height={44} priority />
                </span>
                <span>
                  <strong>RePlate</strong>
                  <small>Surplus food network</small>
                </span>
              </Link>
              <nav className="nav">
                <Link href="/auth" className="buttonGhost">Access roles</Link>
                <Link href="/dashboard/restaurant" className="button">Open MVP</Link>
              </nav>
            </header>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
