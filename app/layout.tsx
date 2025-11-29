import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Disk Scheduling Simulator",
  description: "Visualize and compare disk scheduling algorithms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-disk-navy text-white">
        {children}
      </body>
    </html>
  );
}
