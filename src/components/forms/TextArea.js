"use client";
export default function TextArea({ label, error, className = "", ...props }) {
  return (
    <div>
      {label && <label className="form-label">{label}</label>}
      <textarea {...props} className={`input-basic ${className}`} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
