import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hearts2Hearts Haven - H2H Fan Site",
  description:
    "Official fan site for Hearts2Hearts (H2H) - Jiwoo, Carmen, Yuha, Stella, Juun, A-na, Ian, Ye-on. Join S2U community!",
  keywords: "Hearts2Hearts, H2H, K-pop, girl group, S2U, Carmen, Jiwoo, FOCUS",
  icons: {
    icon: "/images/h2h_logo.png",
    shortcut: "/images/h2h_logo.png",
    apple: "/images/h2h_logo.png",
  },
  openGraph: {
    title: "Hearts2Hearts Haven - H2H Fan Site",
    description: "Join S2U community and celebrate H2H! 💕",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} antialiased`}>
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
