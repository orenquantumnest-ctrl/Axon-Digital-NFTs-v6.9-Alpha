import type { Metadata } from "next";
import "./globals.css"; // Global styles

export const metadata: Metadata = {
  title: "AXON DIGITAL NFTs | Administrative Core",
  description: "Elite NFT ecosystem and smart management layer for AXON DIGITAL.",
  icons: {
    icon: "/axon-logo-icon.png",
    shortcut: "/axon-logo-icon.png",
    apple: "/axon-logo-icon.png",
  },
  openGraph: {
    title: "AXON DIGITAL NFTs",
    description: "Elite NFT ecosystem and smart management layer for AXON DIGITAL.",
    images: [{ url: "/axon-share-card.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AXON DIGITAL NFTs",
    description: "Elite NFT ecosystem and smart management layer for AXON DIGITAL.",
    images: ["/axon-share-card.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
