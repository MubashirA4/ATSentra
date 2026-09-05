import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import AuthLayout from "@layouts/AuthLayout";
import AuthInput from "@features/auth/components/AuthInput";
import PasswordInput from "@features/auth/components/PasswordInput";
import { useAuth } from "@store/auth/AuthContext";
import getErrorMessage from "@utils/getErrorMessage";

const Signup = () => {
  const navigate = useNavigate();

  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");

    const normalizedName = name.trim();
    const normalizedEmail = email.trim();

    if (!normalizedName) {
      setError("Please enter your full name.");
      return;
    }

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters.",
      );
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      await signUp({
        name: normalizedName,
        email: normalizedEmail,
        password,
        confirmPassword,
      });

      navigate("/candidate/dashboard", { replace: true });
    } catch (error) {
      console.error("Signup failed:", error);

      setError(
        getErrorMessage(
          error,
          "Unable to create your account. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      description="Start understanding how ATS systems evaluate your resume."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-forest-800 hover:text-mint-500"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        noValidate
      >
        <AuthInput
          id="name"
          label="Full name"
          type="text"
          placeholder="Ahmed Raza"
          autoComplete="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);

            if (error) {
              setError("");
            }
          }}
          disabled={isSubmitting}
        />

        <AuthInput
          id="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);

            if (error) {
              setError("");
            }
          }}
          disabled={isSubmitting}
        />

        <PasswordInput
          id="password"
          label="Password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);

            if (error) {
              setError("");
            }
          }}
          disabled={isSubmitting}
        />

        <PasswordInput
          id="confirm-password"
          label="Confirm password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);

            if (error) {
              setError("");
            }
          }}
          disabled={isSubmitting}
        />

        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-forest-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && (
            <Loader2
              className="h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}

          {isSubmitting
            ? "Creating account..."
            : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Signup;
