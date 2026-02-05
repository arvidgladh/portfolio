import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Infinite Canvas – Arvid Gladh",
  description:
    "Interactive product and campaign cases exploring UX, copy and creative technology.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className} bg-[#F5F5F2] text-[#111827] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
