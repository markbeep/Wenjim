import { ReactNode } from 'react';
import React from 'react';
import { MantineProvider } from '@mantine/core';


export enum Pages {
  home,
}

interface Children {
  children: ReactNode
}

export default function ThemeProvider({ children }: Children) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: "dark" }}>
      {children}
    </MantineProvider>
  )
}
