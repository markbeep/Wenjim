import "../styles/globals.css";
import React from "react";
import PlausibleProvider from "next-plausible";
import Provider from "./provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <PlausibleProvider domain={process.env.HOST ?? "wenjim.markc.su"} />
      <meta name="host" content={process.env.HOST ?? "wenjim.markc.su"} />
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
