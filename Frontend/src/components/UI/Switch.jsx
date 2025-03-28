import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export const Switch = ({ enabled, onChange }) => {
  return (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
      onClick={() => onChange(!enabled)}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      >
        {enabled ? (
          <CheckIcon className="h-3 w-3 text-blue-600 mx-auto" />
        ) : (
          <XMarkIcon className="h-3 w-3 text-gray-400 mx-auto" />
        )}
      </span>
    </button>
  );
};