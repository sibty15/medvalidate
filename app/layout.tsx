import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import './globals.css';
import QueryProvider from "../providers/query-provider";
import { AuthProvider } from "@/hooks/useAuth";
import Header from "./header";
import Footer from "./footer";
import { Toaster } from "@/components/ui/sonner";
// import { supabaseServer } from '@/lib/supabase/server'
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MedValidateAI",
  description: "AI-powered validation and readiness scoring for healthcare startup ideas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${poppins.className}  antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <Header />
            {children}
            <Toaster/>
            <Footer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
