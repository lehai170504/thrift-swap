import AppHeader from "@/components/layout/AppHeader";
import Footer from "@/components/layout/Footer";
import { GlobalChatWidget } from "@/features/chat/components/GlobalChatWidget";
import { CategoryOnboardingModal } from "@/features/onboarding/CategoryOnboardingModal";
import { Suspense } from "react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<div className="h-20 bg-background border-b border-white/10" />}>
        <AppHeader />
      </Suspense>
      <div className="flex-1 bg-background text-foreground">
        {children}
      </div>
      <Footer />
      <GlobalChatWidget />
      <CategoryOnboardingModal />
    </>
  );
}
