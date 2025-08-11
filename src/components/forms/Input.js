"use client";
export default function Input({ label, error, className = "", ...props }) {
  return (
    <div>
      {label && <label className="form-label">{label}</label>}
      <input {...props} className={`input-basic ${className}`} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
