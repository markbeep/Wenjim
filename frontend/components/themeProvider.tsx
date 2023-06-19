"use client";
import { ReactNode, useCallback, useEffect, useState } from "react";
import React from "react";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  createEmotionCache,
} from "@mantine/core";
import { useServerInsertedHTML } from "next/navigation";

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

  const cache = createEmotionCache({ key: "mantine" });
  cache.compat = true;

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(" "),
      }}
    />
  ));

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
        }}
        emotionCache={cache}
      >
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
