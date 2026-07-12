import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

// OSUIProvider is a 'use client' component — imported dynamically so the
// server layout itself remains a React Server Component.
// It is only rendered for non-/studio paths.
import { OSUIProvider } from "@/components/os-ui/OSUIProvider";

export const metadata: Metadata = {
  title: "Portfolio Draft",
  description: "A premium desktop-first portfolio with a hidden CMS studio.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read the x-pathname header injected by middleware.ts so we can decide
  // whether to wrap the page in the OS_UI without reaching for usePathname()
  // (which would force this layout to become a client component).
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";
  const isStudio = pathname.startsWith("/studio");

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {isStudio ? (
          // /studio route: render children directly — no OS_UI wrapper,
          // no viewport-lock styles, Sanity Studio keeps its own layout.
          children
        ) : (
          // All other routes: wrap in OS_UI provider which mounts the
          // Desktop, Wallpaper, Dock, and Window Manager. The children
          // (existing page content) are suppressed visually in OS mode
          // but preserved in the tree for SEO/meta purposes.
          <OSUIProvider initialRoute={pathname}>{children}</OSUIProvider>
        )}
      </body>
    </html>
  );
}
