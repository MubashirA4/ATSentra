import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import { useAuth } from "../../context/AuthContext";
import getErrorMessage from "../../utils/getErrorMessage";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const from =
    location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setIsSubmitting(true);

      await signIn({
        email: normalizedEmail,
        password,
      });

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);

      setError(
        getErrorMessage(
          error,
          "Unable to sign in. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue analyzing and improving your resume."
      footer={
        <>
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-forest-800 hover:text-mint-500"
          >
            Create an account
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
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);

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
            ? "Signing in..."
            : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;