import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import NoteProvider from "@/providers/NoteProvider";

// Simple ErrorBoundary fallback
function SafeServerComponent({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  try {
    return <>{children}</>;
  } catch (err) {
    console.error("Server component error:", err);
    return <>{fallback}</>;
  }
}

export const metadata: Metadata = {
  title: "Note App Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NoteProvider>
            <SidebarProvider>
              {/* AppSidebar safely rendered */}
              <SafeServerComponent fallback={<div className="w-60 bg-gray-100">Sidebar failed to load</div>}>
                <AppSidebar />
              </SafeServerComponent>

              <div className="flex min-h-screen w-full flex-col">
                {/* Header safely rendered */}
                <SafeServerComponent fallback={<header className="h-24 bg-gray-200">Header failed to load</header>}>
                  <Header />
                </SafeServerComponent>

                <main className="flex flex-1 flex-col px-4 pt-10 xl:px-8">
                  {children}
                </main>
              </div>
            </SidebarProvider>

            <Toaster />
          </NoteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
