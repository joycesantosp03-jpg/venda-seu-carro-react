export const MAX_PHOTO_COUNT = 5;
export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function getCurrentDateInputValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isValidDateInput(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1];
}

export function validatePhotos(photos) {
  const errors = [];

  if (photos.length === 0) {
    errors.push("Adicione pelo menos uma foto do veículo");
    return errors;
  }

  if (photos.length > MAX_PHOTO_COUNT) {
    errors.push(`Selecione no máximo ${MAX_PHOTO_COUNT} fotos`);
  }

  if (photos.some((photo) => !ALLOWED_PHOTO_TYPES.has(photo.type))) {
    errors.push("Use fotos nos formatos JPG, PNG ou WebP");
  }

  if (photos.some((photo) => photo.size > MAX_PHOTO_SIZE_BYTES)) {
    errors.push("Cada foto deve ter no máximo 5 MB");
  }

  return errors;
}

export function validateVehicleForm(form, photos) {
  const errors = {};
  const title = form.title.trim();

  if (!title) {
    errors.title = "O título é obrigatório";
  } else if (title.length < 3 || title.length > 30) {
    errors.title = "O título deve ter entre 3 e 30 caracteres";
  }

  const price = form.price.trim();
  if (
    !/^\d+(?:\.\d{1,2})?$/.test(price) ||
    !Number.isFinite(Number(price)) ||
    Number(price) <= 0
  ) {
    errors.price = "Informe um preço maior que zero com até 2 casas decimais";
  }

  if (!form.description.trim()) {
    errors.description = "A descrição é obrigatória";
  } else if (form.description.trim().length > 2000) {
    errors.description = "A descrição deve ter no máximo 2.000 caracteres";
  }

  if (!form.brand.trim()) {
    errors.brand = "A marca é obrigatória";
  } else if (form.brand.trim().length > 50) {
    errors.brand = "A marca deve ter no máximo 50 caracteres";
  }

  if (!form.model.trim()) {
    errors.model = "O modelo é obrigatório";
  } else if (form.model.trim().length > 50) {
    errors.model = "O modelo deve ter no máximo 50 caracteres";
  }

  const mileage = form.mileage.trim();
  if (!/^\d+$/.test(mileage) || !Number.isSafeInteger(Number(mileage))) {
    errors.mileage = "Informe uma quilometragem inteira igual ou maior que zero";
  }

  if (!form.purchase_date) {
    errors.purchase_date = "A data de compra é obrigatória";
  } else if (
    !isValidDateInput(form.purchase_date) ||
    form.purchase_date > getCurrentDateInputValue()
  ) {
    errors.purchase_date = "Informe uma data válida que não seja futura";
  }

  if (!form.gear) {
    errors.gear = "Selecione o câmbio";
  }

  const photoErrors = validatePhotos(photos);
  if (photoErrors.length > 0) {
    errors.photos = photoErrors[0];
  }

  return errors;
}