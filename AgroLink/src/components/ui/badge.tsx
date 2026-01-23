import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-black transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-brand-primary text-text-on-brand hover:bg-brand-primary/80 shadow-sm",
                secondary:
                    "border-transparent bg-brand-secondary text-text-on-brand hover:bg-brand-secondary/80 shadow-sm",
                success:
                    "border-transparent bg-status-success text-white hover:bg-status-success/80 shadow-sm",
                warning:
                    "border-transparent bg-status-warning text-white hover:bg-status-warning/80 shadow-sm",
                info:
                    "border-transparent bg-status-info text-white hover:bg-status-info/80 shadow-sm",
                error:
                    "border-transparent bg-status-error text-white hover:bg-status-error/80 shadow-sm",
                outline: "text-text-primary border-border-base hover:bg-bg-muted/50",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    asChild?: boolean
}

const Badge: React.FC<BadgeProps> = ({ className, variant, asChild = false, ...props }) => {
    const Comp = asChild ? Slot : "div"
    return (
        <Comp className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
