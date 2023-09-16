"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeProvider from "../components/themeProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Shell from "./shell";

export default function Provider({ children }: React.PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Shell>{children}</Shell>
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
