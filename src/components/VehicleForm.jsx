import FormField from "./FormField.jsx";
import GearSelector from "./GearSelector.jsx";
import OptionalsList from "./OptionalsList.jsx";
import PhotoUpload from "./PhotoUpload.jsx";
import { getCurrentDateInputValue } from "../utils/validateVehicleForm.js";
import { useVehicleForm } from "../hooks/useVehicleForm.js";

export default function VehicleForm({ onSaved }) {
  const {
    form,
    optionals,
    photos,
    errors,
    sent,
    saving,
    submissionError,
    handleChange,
    handlePhotoChange,
    handleSubmit,
    toggleOptional,
  } = useVehicleForm(onSaved);

  return (
    <div className="form-container">
      <div className="form-header">
        <p>Formulário</p>
      </div>
      <div className="form-body">
        <h1 className="form-title">Venda fácil seu carro!</h1>
        <p>Descreva as características e marque as opcionais que ele possui</p>

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Título do anúncio"
            name="title"
            value={form.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Um título para anunciar seu carro"
            minLength={3}
            maxLength={30}
            required
          />
          <FormField
            label="Preço"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            error={errors.price}
            placeholder="Defina o preço"
            min="0.01"
            step="0.01"
            required
          />
          <FormField
            label="Descrição"
            name="description"
            type="textarea"
            value={form.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="Coloque aqui os detalhes do veículo"
            maxLength={2000}
            required
            wide
          />
          <FormField
            label="Marca"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            error={errors.brand}
            placeholder="Digite a marca do veículo"
            maxLength={50}
            required
          />
          <FormField
            label="Modelo"
            name="model"
            value={form.model}
            onChange={handleChange}
            error={errors.model}
            placeholder="Digite o modelo do veículo"
            maxLength={50}
            required
          />
          <FormField
            label="Quilometragem"
            name="mileage"
            type="number"
            value={form.mileage}
            onChange={handleChange}
            error={errors.mileage}
            placeholder="Digite a quilometragem do veículo"
            min="0"
            step="1"
            required
          />
          <FormField
            label="Data de compra"
            name="purchase_date"
            type="date"
            value={form.purchase_date}
            onChange={handleChange}
            error={errors.purchase_date}
            max={getCurrentDateInputValue()}
            required
          />

          <GearSelector
            value={form.gear}
            onChange={handleChange}
            error={errors.gear}
          />
          <OptionalsList selected={optionals} onToggle={toggleOptional} />
          <PhotoUpload
            photos={photos}
            onChange={handlePhotoChange}
            error={errors.photos}
          />

          <button type="submit" className="btn-submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar anúncio"}
          </button>
          {submissionError && (
            <p className="error-message" role="alert">
              {submissionError}
            </p>
          )}
          {sent && (
            <p className="success-message" role="status" aria-live="polite">
              Anúncio e fotos salvos neste navegador.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}