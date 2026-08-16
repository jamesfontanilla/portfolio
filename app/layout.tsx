import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { OSUIProvider } from "@/components/os-ui/OSUIProvider";
import { getPortfolioData, portfolioData } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "Portfolio Draft",
  description: "A premium desktop-first portfolio with structured local content.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";
  const isAdmin = pathname.startsWith("/admin");
  const isProjectDetail = pathname.startsWith("/projects/");
  const useOsShell = !isAdmin && !isProjectDetail;
  const data = useOsShell ? await getPortfolioData() : portfolioData;

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
        {useOsShell ? <OSUIProvider initialRoute={pathname} initialData={data}>{children}</OSUIProvider> : children}
      </body>
    </html>
  );
}
