// components/ExpandedModal.jsx
import { X } from "lucide-react";
import React from "react";

const ExpandedModal = ({ isOpen, animationClass, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={`expanded-background fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40 ${animationClass}`}>
      <div className={`expanded-modal bg-background px-7 py-6 rounded-2xl w-[70%] h-[72%] shadow-lg relative flex flex-col ${animationClass}`}>
        {/* Close Button */}
        <button className="absolute top-3 right-3 text-foreground cursor-pointer" onClick={onClose}>
          <X size={24} />
        </button>

        {children}
      </div>
    </div>
  );
};

export default ExpandedModal;