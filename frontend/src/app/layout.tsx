import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { GlobalCommandPalette } from "@/components/layout/GlobalCommandPalette";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { AnalyticsManager } from "@/components/layout/AnalyticsManager";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: '--font-inter' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin", "vietnamese"], variable: '--font-plus-jakarta' });
const playfair = Playfair_Display({ subsets: ["latin", "vietnamese"], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "Thriftly - E-commerce platform",
  description: "Nền tảng thanh lý đồ cũ và đấu giá thông minh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${plusJakarta.variable} ${inter.variable} ${playfair.variable} antialiased`}>
      <head>
        <AnalyticsManager />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-primary overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Providers>
            <GlobalCommandPalette />
            <AnnouncementBanner />
            <main className="flex-1">
              {children}
            </main>
            <CookieConsent />
            <Toaster position="bottom-right" />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
