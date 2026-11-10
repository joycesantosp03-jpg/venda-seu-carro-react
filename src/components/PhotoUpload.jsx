import { MAX_PHOTO_COUNT } from "../utils/validateVehicleForm.js";

export default function PhotoUpload({ photos, onChange, error }) {
  const errorId = "photos-error";

  return (
    <div className="photo-upload">
      <label htmlFor="photos">
        Fotos do veículo <span className="required-indicator" aria-hidden="true">*</span>
        <span className="visually-hidden"> obrigatório</span>
      </label>
      <p className="field-hint" id="photos-hint">
        JPG, PNG ou WebP; até {MAX_PHOTO_COUNT} fotos de 5 MB cada.
      </p>
      <input
        id="photos"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        required
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${errorId} photos-hint` : "photos-hint"}
      />
      {photos.length > 0 && (
        <ul className="selected-photo-list" aria-label="Fotos selecionadas">
          {photos.map((photo, index) => (
            <li key={`${photo.name}-${photo.lastModified}-${index}`}>
              {photo.name} ({(photo.size / (1024 * 1024)).toFixed(2)} MB)
            </li>
          ))}
        </ul>
      )}
      {error && (
        <span id={errorId} className="error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
