import * as React from "react";
import { IMaskInput } from "react-imask";
import { cn } from "./utils";
import { Label } from "./label";

interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onAccept'> {
    mask: string | any;
    value?: string;
    onAccept?: (value: string, mask: any) => void;
    label?: string;
    error?: string;
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
    ({ className, mask, onAccept, label, id, error, value = "", ...props }, ref) => {
        return (
            <div className="grid w-full items-center gap-1.5 text-left">
                {label && <Label htmlFor={id} className={cn(error && "text-destructive")}>{label}</Label>}
                <IMaskInput
                    mask={mask}
                    unmask={true}
                    value={value}
                    onAccept={onAccept}
                    id={id}
                    className={cn(
                        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        error && "border-destructive focus-visible:ring-destructive/20",
                        className
                    )}
                    inputRef={(el) => {
                        if (typeof ref === "function") {
                            ref(el as HTMLInputElement);
                        } else if (ref && 'current' in ref) {
                            (ref as any).current = el as HTMLInputElement;
                        }
                    }}
                    {...(props as any)}
                />
                {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>
        );
    }
);

MaskedInput.displayName = "MaskedInput";

export { MaskedInput };
