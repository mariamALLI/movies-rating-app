import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/components/providers/session-provider";
import QueryProvider from "@/components/providers/query-provider";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie Rating App",
  description: "Rate and Manage your favorite movies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${playfairDisplay.variable} antialiased dark`}
      >
        {/* The provider is used to shield the children in order to prevent loading errors */}
        <NextAuthProvider>
          <QueryProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
            </ThemeProvider>
          </QueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
