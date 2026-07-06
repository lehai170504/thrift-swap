import AppHeader from "@/components/layout/AppHeader";
import Footer from "@/components/layout/Footer";
import { GlobalChatWidget } from "@/features/chat/components/GlobalChatWidget";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      <div className="flex-1 bg-neutral-50">
        {children}
      </div>
      <Footer />
      <GlobalChatWidget />
    </>
  );
}
