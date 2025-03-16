import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

export const DynamicSelect = ({
  name,
  options,
  title,
  value,
  onChange,
  width,    
  bg,
  border,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown open/close
  const handleToggle = () => setIsOpen((prev) => !prev);

  // Call onChange with a synthetic event format
  const handleOptionSelect = (selected) => {
    onChange({ target: { name, value: selected } });
    setIsOpen(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={`flex justify-between items-center border ${border ? border : 'border-gray-700'} p-2 rounded-sm ${bg ? bg : 'bg-white'} ${width ? width : 'w-1/2'}`}
      >
        <span className="text-black">
          {value || title}
        </span>
        <ChevronDownIcon className="h-5 w-5 text-gray-600" />
      </button>
      {isOpen && (
        <div className="absolute right-0 md:left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-10">
          <div className="p-2 space-y-1">
            {options && options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors gap-2"
              >
                <span>{option.label || option}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
