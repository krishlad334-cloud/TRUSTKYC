import { useState } from "react";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import { X } from "lucide-react";

export function AppShell({ kind = "business", children, header }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground overflow-x-hidden">
      {/* Desktop Sidebar (Fixed) */}
      <div className="hidden md:block fixed inset-y-0 left-0 w-64 h-screen bg-sidebar border-r border-sidebar-border z-30">
        <AppSidebar kind={kind} />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative flex flex-col w-64 max-w-xs h-full bg-sidebar border-r border-sidebar-border animate-in slide-in-from-left duration-200 z-10">
            <div className="absolute right-3 top-4 z-50">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground active:scale-95 cursor-pointer"
                aria-label="Close sidebar"
              >
                <X className="size-4" />
              </button>
            </div>

            <AppSidebar kind={kind} onLinkClick={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {header && (
          <AppHeader
            title={header.title}
            subtitle={header.subtitle}
            onMenuClick={() => setSidebarOpen(true)}
          />
        )}

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
export default AppShell;
