import type {
  InputHTMLAttributes,
} from "react";

interface AuthInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AuthInput = ({
  label,
  error,
  id,
  ...props
}: AuthInputProps) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-text-primary"
      >
        {label}
      </label>

      <input
        id={id}
        {...props}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-muted ${
          error
            ? "border-danger focus:border-danger"
            : "border-cream-300 focus:border-mint-500"
        }`}
      />

      {error && (
        <p className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;