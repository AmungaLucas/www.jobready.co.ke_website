"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function InputField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  helperText,
  leftIcon,
  required = false,
  disabled = false,
  className = "",
  autoComplete,
  maxLength,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const inputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className={`mb-5 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700 mb-1.5 block"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          maxLength={maxLength}
          className={`w-full px-4 py-3 border text-sm transition-colors outline-none ${
            error
              ? "border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-400"
              : "border-gray-200 focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
          } rounded-xl bg-white ${disabled ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "text-gray-800"} ${
            leftIcon ? "pl-10" : ""
          } ${isPassword ? "pr-11" : ""}`}
        />

        {/* Right icon (password toggle) */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}

        {/* Right icon (custom) */}
        {!isPassword && typeof leftIcon === "undefined" && null}
      </div>

      {/* Error */}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {/* Helper text */}
      {!error && helperText && (
        <p className="text-xs text-gray-400 mt-1">{helperText}</p>
      )}
    </div>
  );
}
