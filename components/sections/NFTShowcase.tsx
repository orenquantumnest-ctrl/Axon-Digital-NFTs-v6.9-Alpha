"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import React, { useRef } from "react";

function NFTCard({ src, name, price, index }: { src: string, name: string, price: string, index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="relative w-full aspect-square rounded-2xl cursor-pointer group"
    >
      <div className="absolute inset-0 rounded-2xl glass-panel border-[#00FFB2]/20 group-hover:border-[#00FFB2]/50 transition-colors duration-500 overflow-hidden" style={{ transform: "translateZ(30px)" }}>
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 pb-6 pt-12 px-6">
          <h3 className="text-xl font-display font-bold text-white mb-1">{name}</h3>
          <p className="text-[#00FFB2] font-mono text-sm">{price}</p>
        </div>
      </div>
    </motion.div>
  );
}

const NFTS = [
  { name: "Axon Genesis #001", price: "2.5 ETH", src: "https://picsum.photos/seed/axon1/1024/1024" },
  { name: "Axon Void #042", price: "1.8 ETH", src: "https://picsum.photos/seed/axon2/1024/1024" },
  { name: "Axon Lumina #088", price: "3.2 ETH", src: "https://picsum.photos/seed/axon3/1024/1024" },
];

export function NFTShowcase() {
  return (
    <section className="py-24 relative z-10 max-w-7xl mx-auto px-6" id="showcase">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Exclusive </span>
          <span className="text-gradient-emerald">Collection</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Hover or tap to interact with the 3D assets. High-fidelity glassmorphism models minted natively on the layer-1 chain.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10" style={{ perspective: "1000px" }}>
        {NFTS.map((nft, idx) => (
          <NFTCard key={idx} {...nft} index={idx} />
        ))}
      </div>
    </section>
  );
}
