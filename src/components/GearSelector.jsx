export default function GearSelector({ value, onChange, error }) {
  return (
    <fieldset
      className="gear-selector"
      aria-required="true"
      aria-describedby={error ? "gear-error" : undefined}
    >
      <legend>
        Câmbio <span className="required-indicator" aria-hidden="true">*</span>
        <span className="visually-hidden"> obrigatório</span>
      </legend>
      <label>
        <input
          type="radio"
          name="gear"
          value="manual"
          checked={value === "manual"}
          required
          onChange={onChange}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "gear-error" : undefined}
        />
        Manual
      </label>
      <label>
        <input
          type="radio"
          name="gear"
          value="automatic"
          checked={value === "automatic"}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "gear-error" : undefined}
        />
        Automático
      </label>
      {error && (
        <span id="gear-error" className="error-message" role="alert">
          {error}
        </span>
      )}
    </fieldset>
  );
}
