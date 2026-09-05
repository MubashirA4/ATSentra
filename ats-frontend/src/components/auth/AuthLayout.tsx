import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  footer?: ReactNode;
}

const AuthLayout = ({
  children,
  title,
  description,
  footer,
}: AuthLayoutProps) => {
  return (
    <main className="min-h-screen bg-cream-50">
      <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
        <section className="hidden bg-forest-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>

              <span className="font-display text-xl">
                ATSentra
              </span>
            </div>

            <div className="mt-24 max-w-md">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mint-300">
                Intelligent resume analysis
              </p>

              <h2 className="mt-5 font-display text-5xl leading-tight">
                Build a resume that gets understood.
              </h2>

              <p className="mt-6 text-sm leading-7 text-white/65">
                Understand how applicant tracking systems evaluate
                your resume and discover where you can improve.
              </p>
            </div>
          </div>

          <p className="text-xs text-white/40">
            Resume intelligence for modern job seekers.
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <div className="lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-900 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>

                <span className="font-display text-xl text-text-primary">
                  ATSense
                </span>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <h1 className="font-display text-4xl text-text-primary">
                {title}
              </h1>

              <p className="mt-3 text-sm leading-6 text-text-secondary">
                {description}
              </p>

              <div className="mt-8">
                {children}
              </div>

              {footer && (
                <div className="mt-7 text-center text-sm text-text-secondary">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;