import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { OSUIProvider } from "@/components/os-ui/OSUIProvider";
import { getPortfolioData, portfolioData } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "James Fontanilla",
  description: "A premium desktop-first portfolio with structured local content.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";
  const isAdmin = pathname.startsWith("/admin");
  const data = isAdmin ? portfolioData : await getPortfolioData();

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
        {isAdmin ? children : <OSUIProvider initialRoute={pathname} initialData={data}>{children}</OSUIProvider>}
      </body>
    </html>
  );
}
