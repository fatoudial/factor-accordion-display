
import * as React from "react";
import { cn } from "@/lib/utils";

interface GridProps extends React.ComponentPropsWithoutRef<"div"> {
  cols?: number | string;
  rows?: number | string;
  gap?: number | string;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, rows = 1, gap = 4, ...props }, ref) => {
    const gridStyle = {
      display: "grid",
      gridTemplateColumns: typeof cols === "number" ? `repeat(${cols}, minmax(0, 1fr))` : cols,
      gridTemplateRows: typeof rows === "number" ? `repeat(${rows}, minmax(0, 1fr))` : rows,
      gap: typeof gap === "number" ? `${gap * 0.25}rem` : gap,
    };

    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{ ...gridStyle, ...props.style }}
        {...props}
      />
    );
  }
);

Grid.displayName = "Grid";

export { Grid };
