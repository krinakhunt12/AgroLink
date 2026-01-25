import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-bg-surface group-[.toaster]:text-text-primary group-[.toaster]:border-border-base group-[.toaster]:shadow-theme rounded-2xl p-4",
                    description: "group-[.toast]:text-text-muted",
                    actionButton:
                        "group-[.toast]:bg-brand-primary group-[.toast]:text-text-on-brand font-bold",
                    cancelButton:
                        "group-[.toast]:bg-bg-muted group-[.toast]:text-text-muted",
                    success: "group-[.toaster]:bg-status-success group-[.toast]:text-white",
                    error: "group-[.toaster]:bg-status-error group-[.toast]:text-white",
                    warning: "group-[.toaster]:bg-status-warning group-[.toast]:text-white",
                    info: "group-[.toaster]:bg-status-info group-[.toast]:text-white",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
