"use client";
export default function Select({
  label,
  children,
  error,
  className = "",
  ...props
}) {
  return (
    <div>
      {label && <label className="form-label">{label}</label>}
      <select {...props} className={`input-basic ${className}`}>
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
