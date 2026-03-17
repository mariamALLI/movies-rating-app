import { X } from "lucide-react";
import { useEffect } from "react";
import type { ModalProps } from "@/lib/global-types";

export default function Modal({ title, isOpen, onClose, children }: ModalProps) {
  // close modal on escape key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      // prevent background scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      // restore background scrolling when modal is closed
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 dark:shadow-lg dark:black/80">
      {/* backdrop with blur and opacity */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      {/* Modal content */}
      <div
        className="relative z-10 bg-white p-6 rounded-lg shadow-2xl w-full max-w-2xl  mx-4 max-h-[90vh] overflow-y-auto dark:bg-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <section className="modal-header mb-4 flex items-center justify-between border-b px-4 py-2 rounded-lg bg-gray-800/60">
          <h3 className="modal-title text-white flex items-center justify-between w-full">
            {title}
          </h3>
          <button
            className="modal-close-button px-2 hover:bg-gray-100 rounded-full transition"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </section>

        {/* body */}
        <div className="modal-inner p-6">{children}</div>
      </div>
    </div>
  );
}
