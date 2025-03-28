import { forwardRef } from 'react';

export const Input = forwardRef(
  ({
    className,
    type,
    name,
    placeholder,
    value,
    width,
    onChange,
    required = true,
    checked,
    maxLength,
    border,
    text,
    style,
    readOnly = false,
    icon, // Add icon prop
  }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          readOnly={readOnly}
          onChange={onChange}
          maxLength={maxLength}
          checked={checked}
          className={`w-full px-4 py-2 ${
            icon ? 'pl-10' : 'pl-4'
          } border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
            className || ''
          }`}
          style={style}
          required={required}
        />
      </div>
    );
  }
);


Input.displayName = 'Input';