import { ReactNode } from "react";
import { Navigation } from "./Navigation";
interface LayoutProps {
  children: ReactNode;
}
export function Layout({
  children
}: LayoutProps) {
  return <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {children}
      </main>
      <footer className="border-t border-border mt-20 py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">© 2026 Resume Analyzer. All rights reserved.</p>
        </div>
      </footer>
    </div>;
}