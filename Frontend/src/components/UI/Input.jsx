
export const Input = ({
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
}) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      readOnly={readOnly}
      onChange={onChange}
    
      maxLength={maxLength}
      checked={checked}
      className={`w-full p-2 border border-gray-400 rounded-md ${className}`}
    />
    
  );
};
