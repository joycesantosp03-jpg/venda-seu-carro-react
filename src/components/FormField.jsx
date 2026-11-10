export default function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  maxLength,
  minLength,
  min,
  max,
  step,
  type = "text",
  error,
  required = false,
  wide = false,
}) {
  const errorId = `${name}-error`;
  const fieldClassName = wide ? "form-field form-field--wide" : "form-field";

  return (
    <div className={fieldClassName}>
      <label htmlFor={name}>
        {label}
        {required && (
          <>
            {" "}
            <span className="required-indicator" aria-hidden="true">
              *
            </span>
            <span className="visually-hidden"> obrigatório</span>
          </>
        )}
      </label>
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          minLength={minLength}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          required={required}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          minLength={minLength}
          min={min}
          max={max}
          step={step}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          required={required}
        />
      )}
      {error && (
        <span id={errorId} className="error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
