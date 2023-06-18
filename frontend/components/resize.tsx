import { useMantineTheme } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";

/**
Checks the size of the window to allow for easily checking if it should be
mobile formatted or desktop
*/
export default function useResize(
  breakpoint?: string,
  default_ = false,
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const theme = useMantineTheme();
  // 1 rem = 16 px
  const numBreakpoint =
    parseInt(breakpoint ? breakpoint : theme.breakpoints.sm) * 16;
  const [show, setShow] = useState(default_);
  const handleResize = useCallback(
    (width: number) => {
      if (width < numBreakpoint) {
        setShow(false);
      } else {
        setShow(true);
      }
    },
    [numBreakpoint],
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
