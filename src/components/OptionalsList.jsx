const OPTIONALS = [
  { id: "air-conditioning", label: "Ar condicionado" },
  { id: "airbag", label: "Airbag" },
  { id: "abs", label: "Freios ABS" },
  { id: "power-steering", label: "Direção hidráulica" },
  { id: "electric-windows", label: "Vidros elétricos" },
  { id: "electric-locks", label: "Travas elétricas" },
  { id: "alarm", label: "Alarme" },
  { id: "sound", label: "Som" },
];

export default function OptionalsList({ selected, onToggle }) {
  return (
    <fieldset className="optionals-list">
      <legend>Opcionais</legend>
      <div className="optionals-grid">
        {OPTIONALS.map((item) => (
          <label key={item.id} htmlFor={`optional-${item.id}`}>
            <input
              id={`optional-${item.id}`}
              type="checkbox"
              name="optionals"
              checked={selected.includes(item.id)}
              onChange={() => onToggle(item.id)}
            />
            {item.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
