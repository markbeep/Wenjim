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
      <head>
        <PlausibleProvider
          domain="https://wenjim.markc.su" // TODO: make dynamic with env variables
          customDomain="https://plausible.markc.su"
        />
        <meta name="host" content={process.env.HOST} />
      </head>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
