import { ReactNode, useCallback, useEffect, useState } from "react";
import React from "react";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { Global } from "@emotion/react";

export enum Pages {
  home,
}

interface Children {
  children: ReactNode;
}

export default function ThemeProvider({ children }: Children) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const toggleColorScheme = useCallback(
    (value?: ColorScheme) => {
      const color = value || (colorScheme === "dark" ? "light" : "dark");
      setColorScheme(color);
      localStorage.setItem("theme", color);
    },
    [colorScheme],
  );
  useEffect(() => {
    // check colorscheme in localstorage
    const color = localStorage.getItem("theme");
    if (color === "dark" || color === "light") {
      toggleColorScheme(color);
    }
  }, [toggleColorScheme]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme,
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
    </ColorSchemeProvider>
  );
}
