import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:     "border-transparent bg-primary text-white",
        secondary:   "border-transparent bg-overlay text-text-subtle",
        success:     "border-transparent bg-success/20 text-green-400",
        danger:      "border-transparent bg-danger/20 text-red-400",
        warning:     "border-transparent bg-yellow-500/20 text-yellow-400",
        outline:     "border-border-subtle text-text-muted",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
