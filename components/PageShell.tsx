import { Header } from "@/components/Header";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      <Header />
      {children}
    </main>
  );
}
