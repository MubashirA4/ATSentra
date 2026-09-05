import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type {
  InputHTMLAttributes,
} from "react";

interface PasswordInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const PasswordInput = ({
  label,
  error,
  id,
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] =
    useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-text-primary"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          {...props}
          type={showPassword ? "text" : "password"}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 pr-11 text-sm text-text-primary outline-none transition placeholder:text-text-muted ${
            error
              ? "border-danger focus:border-danger"
              : "border-cream-300 focus:border-mint-500"
          }`}
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword((current) => !current)
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-text-primary"
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;