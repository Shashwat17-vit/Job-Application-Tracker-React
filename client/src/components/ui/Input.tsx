import { type InputHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={twMerge(
            clsx(
              "w-full rounded-xl border px-4 py-2.5 text-sm transition-all",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
              "placeholder:text-slate-400",
              error
                ? "border-red-300 focus:ring-red-500"
                : "border-slate-300 hover:border-slate-400",
              className
            )
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
