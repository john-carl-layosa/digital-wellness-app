import type {
  Metadata,
  Viewport,
} from "next";
import {
  Fraunces,
  Inter,
} from "next/font/google";
import "./globals.css";
import { AppProvider } from "../lib/context/AppContext";
import { PWARegister } from "../components/PWARegister";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: [
    "400",
    "500",
    "600",
    "700",
  ],
});

export const metadata: Metadata = {
  applicationName:
    "Rhythms of Relief",
  title: {
    default: "Rhythms of Relief",
    template:
      "%s | Rhythms of Relief",
  },
  description:
    "Your space to pause, listen, reflect, and reset.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      {
        url: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Rhythms of Relief",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#2A1B47",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable}`}
    >
      <body className="font-sans">
        <AppProvider>
          <PWARegister />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}