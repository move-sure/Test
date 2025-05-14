import { Geist, Geist_Mono } from "next/font/google";
import Navbar from '../components/navbar';
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
  title: "Transport Bilty System",
  description: "Manage your transport bilty entries efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900`}
      >
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
