import { useState } from "react";
import { saveAnnouncement } from "../services/vehicleStorage.js";
import {
  validatePhotos,
  validateVehicleForm,
} from "../utils/validateVehicleForm.js";

const INITIAL_FORM = {
  title: "",
  price: "",
  description: "",
  brand: "",
  model: "",
  mileage: "",
  purchase_date: "",
  gear: "",
};

export function useVehicleForm(onSaved) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [optionals, setOptionals] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState("");

  function clearError(name) {
    setErrors((previousErrors) => {
      if (!previousErrors[name]) {
        return previousErrors;
      }

      const nextErrors = { ...previousErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previousForm) => ({ ...previousForm, [name]: value }));
    clearError(name);
  }

  function handlePhotoChange(event) {
    const selectedPhotos = Array.from(event.target.files ?? []);
    setPhotos(selectedPhotos);
    setErrors((previousErrors) => {
      const nextErrors = { ...previousErrors };
      const [photoError] = validatePhotos(selectedPhotos);

      if (photoError) {
        nextErrors.photos = photoError;
      } else {
        delete nextErrors.photos;
      }

      return nextErrors;
    });
  }

  function toggleOptional(id) {
    setOptionals((previousOptionals) =>
      previousOptionals.includes(id)
        ? previousOptionals.filter((item) => item !== id)
        : [...previousOptionals, id]
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (saving) {
      return;
    }

    const formElement = event.currentTarget;
    setSent(false);
    setSubmissionError("");

    const newErrors = validateVehicleForm(form, photos);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setSaving(true);
    let savedAnnouncement;

    try {
      savedAnnouncement = await saveAnnouncement(
        { ...form, optionals },
        photos
      );
    } catch (error) {
      console.error("Não foi possível salvar o anúncio:", error);
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o anúncio neste navegador."
      );
      setSaving(false);
      return;
    }

    setForm({ ...INITIAL_FORM });
    setOptionals([]);
    setPhotos([]);
    setErrors({});
    setSent(true);
    setSaving(false);
    formElement.reset();
    onSaved?.(savedAnnouncement);
  }

  return {
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
  };
}
