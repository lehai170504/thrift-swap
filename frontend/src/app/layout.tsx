import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin", "vietnamese"], variable: '--font-sans' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-heading' });

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
    <html lang="vi" className={`dark ${plusJakarta.variable} ${outfit.variable} antialiased`}>
      <body className="font-sans min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-primary">
        <Providers>

          <main className="flex-1">
            {children}
          </main>
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
