import { useMantineTheme } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";

export default function useResize(
  breakpoint: number = -1,
  default_ = false,
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const theme = useMantineTheme();
  breakpoint = breakpoint < 0 ? theme.breakpoints.sm : breakpoint;
  const [show, setShow] = useState(default_);
  const handleResize = useCallback(
    (width: number) => {
      if (width < breakpoint) {
        setShow(false);
      } else {
        setShow(true);
      }
    },
    [theme],
  );
  // initially check for window size
  useEffect(() => {
    if (typeof window !== "undefined") {
      handleResize(window.innerWidth);
    }
  }, [handleResize]);

  if (typeof window !== "undefined") {
    window.addEventListener("resize", () => {
      handleResize(window.innerWidth);
    });
  }
  return [show, setShow];
}
