import type { Metadata } from "next";
import "./globals.css"; // Global styles

export const metadata: Metadata = {
  title: "AXON DIGITAL NFTs - Own the Future of Digital Assets",
  description: "Elite NFT ecosystem, smart catalog, and decentralized wealth engine for AXON DIGITAL. Secure, premium, and financially powerful Web3 collectibles.",
  keywords: "AXON, DIGITAL, NFTs, Web3, Blockchain, BNB Smart Chain, BEP20, Base, Digital Wealth, Smart Catalog, Premium Assets, NFT Marketplace",
  icons: {
    icon: "/axon-logo-icon.png",
    shortcut: "/axon-logo-icon.png",
    apple: "/axon-logo-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://axondigitalnfts.com",
    title: "AXON DIGITAL NFTs | Premium Web3 Collectibles Ecosystem",
    description: "Experience the next evolution of digital assets with AXON DIGITAL. High performance multi-layer liquid glass NFT ecosystem.",
    siteName: "AXON DIGITAL NFTs",
    images: [{ 
      url: "/axon-share-card.png",
      width: 1200,
      height: 630,
      alt: "AXON DIGITAL NFTs Share Card"
    }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@AxonDigitalNFTs",
    title: "AXON DIGITAL NFTs | Own the Future of Digital Assets",
    description: "Premium digital portfolio catalog with elite 120fps GPU performance, liquidated glass UI designs, and decentralized referral engines.",
    images: ["/axon-share-card.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Global image loader configuration helper for external image optimization in static and dynamic renders
const axonImageLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  // If external picsum or custom image source, optimize or return optimized parameters
  if (src.includes("picsum.photos")) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }
  return `${src}?w=${width}&q=${quality || 75}`;
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
