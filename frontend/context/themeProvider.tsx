import { ReactNode } from "react";
import React from "react";
import { MantineProvider } from "@mantine/core";
import { Global } from "@emotion/react";

export enum Pages {
  home,
}

interface Children {
  children: ReactNode;
}

export default function ThemeProvider({ children }: Children) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
        fontFamily: "OpenSans, sans-serif",
      }}
    >
      <Global
        styles={[
          {
            "@font-face": {
              fontFamily: "OpenSans",
              src: "local('OpenSans'), url('OpenSans-Regular.ttf') format('truetype')",
              fontDisplay: "swap",
            },
          },
        ]}
      />
      {children}
    </MantineProvider>
  );
}
