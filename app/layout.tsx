import type { Metadata } from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";



export const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: [ "400", "500", "600", "700"],
});




export const metadata: Metadata = {
  title: "AI-PhoneReview",
  description: "creat phone mobile reviews by AI",
   icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interSans.variable} bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
