// src/app/fonts.ts
import localFont from "next/font/local";

export const cormorant = localFont({
  src: [
    { path: "./fonts/CormorantGaramond-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/CormorantGaramond-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/CormorantGaramond-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-cormorant",
  display: "swap",
});

export const openSans = localFont({
  src: [
    { path: "./fonts/OpenSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/OpenSans-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-open-sans",
  display: "swap",
});
