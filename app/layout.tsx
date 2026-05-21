import './globals.css';
import React from 'react';

export const metadata = {
  title: 'AXON DIGITAL NFTs - Own the Future of Digital Assets',
  description: 'Futuristic, elite, Web3 premium NFT ecosystem brand AXON DIGITAL. Purchase premium plans, explore elite digital collections, and join the revolution.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:wght@400;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[#0A0A0A] text-gray-100 min-h-screen selection:bg-[#00FFB2] selection:text-[#0A0A0A] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
