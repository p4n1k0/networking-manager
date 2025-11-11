"use client";

export default function Select({ label, options = [], error, className = "", ...props }) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="text-sm font-medium mb-1 text-gray-700">{label}</label>
      )}
      <select
        {...props}
        className={`border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 
        ${error ? "border-red-500" : "border-gray-300"}`}
      >
        <option value="">Selecione...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-600 mt-1">{error}</span>}
    </div>
  );
}
