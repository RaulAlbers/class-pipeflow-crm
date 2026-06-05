import { SidebarContent } from "@/components/shared/Sidebar";
import { TopBar } from "@/components/shared/TopBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col bg-sidebar border-r border-border">
        <SidebarContent />
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
