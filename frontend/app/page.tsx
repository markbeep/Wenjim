import { Metadata } from "next";
import Index from ".";

export const metadata: Metadata = {
  title: "Wenjim | ASVZ Data & Graphs",
  description:
    "View data & graphs from ASVZ, find out what spots are the least crowded, and at what time how many are in the gym.",
  icons: {
    icon: "/assets/favicon.png",
    shortcut: "/assets/favicon.png",
    apple: "/assets/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Wenjim | ASVZ Data & Graphs",
    description: "Open source ASVZ Data and Graphs",
  },
  authors: [{ name: "Markbeep" }],
};

export default function RootPage() {
  return <Index />;
}
