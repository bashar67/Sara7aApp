import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeProvider";
import Header from "@/components/header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TruthBox | صندوق الحقيقة",
  description: "Receive honest anonymous messages safely and easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased font-display transition-colors duration-700`}
      >
        <ThemeProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="min-h-screen">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
