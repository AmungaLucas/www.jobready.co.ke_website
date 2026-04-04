"use client";

export default function PasswordStrength({ password }) {
  if (!password) return null;

  let score = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  Object.values(checks).forEach((val) => {
    if (val) score++;
  });

  let label = "";
  let color = "";
  let width = "";

  if (score <= 2) {
    label = "Weak";
    color = "bg-red-500";
    width = "w-1/3";
  } else if (score <= 3) {
    label = "Fair";
    color = "bg-amber-500";
    width = "w-2/3";
  } else {
    label = "Strong";
    color = "bg-green-500";
    width = "w-full";
  }

  const labelColor =
    score <= 2
      ? "text-red-500"
      : score <= 3
      ? "text-amber-500"
      : "text-green-500";

  return (
    <div className="mt-2">
      {/* Bar */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color} ${width}`}
        />
      </div>

      {/* Label */}
      <div className="flex justify-between items-center mt-1.5">
        <span className={`text-xs font-medium ${labelColor}`}>{label}</span>
        <div className="flex gap-1">
          {Object.entries(checks).map(([key, passed]) => (
            <span
              key={key}
              className={`text-[10px] ${
                passed ? "text-green-500" : "text-gray-300"
              }`}
            >
              {key === "length"
                ? "8+"
                : key === "uppercase"
                ? "A-Z"
                : key === "lowercase"
                ? "a-z"
                : key === "number"
                ? "0-9"
                : "!@#"}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
