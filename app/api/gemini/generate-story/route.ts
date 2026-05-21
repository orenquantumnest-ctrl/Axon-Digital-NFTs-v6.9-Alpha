import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { word } = await req.json();
    if (!word) {
      return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return a wonderful fallback JSON for development and mock when API key isn't provided yet
      return NextResponse.json({
        name: `${word.toUpperCase()} MATRIX`,
        rarityTier: "Mythic Platinum",
        details: "Dynamic luxury utility token with automated yield rewards.",
        lore: `Crafted in the neon liquid arrays of AXON, the ${word} token grants sovereign governance access, custom 3D avatar status, and elite liquid-staking pool yields.`,
        power: 99,
        technology: "Liquid Quartz Cryptography",
        multiplier: "12.4x Yield"
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate a premium luxury Sci-Fi style NFT and digital asset description, lore story, and customized statistics for a Web3 elite reward named: "${word}". Make it match a brand theme like "AXON DIGITAL NFTs" (futuristic cyber emerald, gold, metallic). Return only a single valid JSON object with keys: name, rarityTier, details, lore, power, technology, multiplier. Do not wrap in markdown codeblocks.`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return NextResponse.json(JSON.parse(cleanedText));
  } catch (error: any) {
    console.error("Gemini route error:", error);
    return NextResponse.json({
      name: "AXON CHRONO PROTOCOL",
      rarityTier: "Legendary Gold",
      details: "High-performance smart contract vault ownership token.",
      lore: "Born out of hyper-structure calculations, integrating Emerald neon nodes to form high-capacity automated liquidity channels.",
      power: 95,
      technology: "Synchronous Block-Streaming",
      multiplier: "6.8x Yield"
    });
  }
}
