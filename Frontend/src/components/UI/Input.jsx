import React from "react";
export const Input = ({
  type,
  name,
  placholder,
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
      placeholder={placholder}
      value={value}
      readOnly={readOnly}
      onChange={onChange}
      required={required}
      maxLength={maxLength}
      checked={checked}
      className={"w-full p-2 mb-4 border rounded-lg"}
    />
  );
};
