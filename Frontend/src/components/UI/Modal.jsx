import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export const Modal = ({ isOpen, onClose, title, children, actions }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/30 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors duration-150"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="text-gray-600 leading-relaxed">
            {children}
          </div>
        </div>

        {/* Footer */}
        {actions && (
          <div className="p-6 pt-4 flex justify-end gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};