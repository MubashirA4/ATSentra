import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";

interface HRConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const HRConfirmDialog = ({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: HRConfirmDialogProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !loading
            ) {
              onCancel();
            }
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="hr-confirm-dialog-title"
            aria-describedby="hr-confirm-dialog-description"
            className="
              relative w-full max-w-md
              overflow-hidden rounded-2xl
              border border-white/10
              bg-forest-950
              shadow-2xl
            "
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 12,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 12,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              aria-label="Close dialog"
              className="
                absolute right-4 top-4
                flex h-8 w-8 items-center justify-center
                rounded-lg
                text-white/50
                transition
                hover:bg-white/[0.06]
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <X size={18} />
            </button>

            <div className="p-6">
              {/* Icon */}
              <div
                className="
                  mb-5 flex h-11 w-11
                  items-center justify-center
                  rounded-xl
                  border border-red-400/20
                  bg-red-400/10
                  text-red-300
                "
              >
                <AlertTriangle size={22} />
              </div>

              {/* Content */}
              <div className="pr-8">
                <h2
                  id="hr-confirm-dialog-title"
                  className="text-lg font-semibold text-white"
                >
                  {title}
                </h2>

                <p
                  id="hr-confirm-dialog-description"
                  className="mt-2 text-sm leading-6 text-white/60"
                >
                  {description}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-7 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={loading}
                  className="
                    rounded-xl
                    border border-white/10
                    bg-white/[0.04]
                    px-4 py-2.5
                    text-sm font-medium
                    text-white/70
                    transition
                    hover:bg-white/[0.08]
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  {cancelText}
                </button>

                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={loading}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl
                    bg-red-500
                    px-4 py-2.5
                    text-sm font-semibold
                    text-white
                    shadow-lg shadow-red-500/10
                    transition
                    hover:bg-red-400
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {loading && (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {loading
                    ? "Deleting..."
                    : confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HRConfirmDialog;