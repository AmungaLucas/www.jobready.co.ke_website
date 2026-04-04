"use client";

import { useRef, useState, useCallback, useEffect } from "react";

export default function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  error,
  autoFocus = false,
}) {
  const inputRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Auto focus on mount if autoFocus
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = useCallback(
    (index, e) => {
      const val = e.target.value;
      // Only accept single digit
      if (val && !/^\d$/.test(val)) return;

      const newValue = value.split("");
      newValue[index] = val;
      const joined = newValue.join("");

      onChange(joined);

      // Auto-focus next input
      if (val && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all filled (call onChange with complete value)
      if (joined.length === length && val) {
        // All digits filled — parent can listen for this
      }
    },
    [value, onChange, length]
  );

  const handleKeyDown = useCallback(
    (index, e) => {
      if (e.key === "Backspace") {
        if (!value[index] && index > 0) {
          // If current is empty, move to previous
          inputRefs.current[index - 1]?.focus();
          const newValue = value.split("");
          newValue[index - 1] = "";
          onChange(newValue.join(""));
        } else {
          // Clear current
          const newValue = value.split("");
          newValue[index] = "";
          onChange(newValue.join(""));
        }
      }

      if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === "ArrowRight" && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [value, onChange, length]
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text").trim();
      const digits = pastedData.replace(/\D/g, "").slice(0, length);

      if (digits.length > 0) {
        onChange(digits.padEnd(length, ""));
        // Focus the next empty input or last input
        const nextEmpty = Math.min(digits.length, length - 1);
        inputRefs.current[nextEmpty]?.focus();
      }
    },
    [onChange, length]
  );

  const handleFocus = useCallback((index) => {
    setFocusedIndex(index);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  return (
    <div>
      <div className="flex gap-2.5 justify-center">
        {Array.from({ length }, (_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] || ""}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            onFocus={() => handleFocus(i)}
            onBlur={handleBlur}
            disabled={disabled}
            className={`w-11 h-13 text-center text-lg font-semibold border-2 rounded-xl transition-all outline-none ${
              error
                ? "border-red-300 text-red-500"
                : focusedIndex === i
                ? "border-[#1a56db] ring-2 ring-[#1a56db]/20"
                : value[i]
                ? "border-[#1a56db] bg-[#1a56db]/5"
                : "border-gray-200 bg-gray-50"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label={`Digit ${i + 1}`}
          />
        ))}
      </div>
      {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}
    </div>
  );
}
