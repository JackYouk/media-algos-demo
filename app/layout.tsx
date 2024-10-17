import type { Metadata } from "next";
import './globals.css'

export const metadata: Metadata = {
  title: "CRWN1 - Media Algos Demo",
  description: "Interactive demo for the algorithms in media presentation.",
};
export const fetchCache = 'force-no-store';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
