import {
  MAX_PHOTO_COUNT,
  MAX_PHOTO_SIZE_BYTES,
  validatePhotos,
} from "../utils/validateVehicleForm.js";

export const VEHICLE_STORAGE_KEY = "vehicle-sale-announcements";

const DATABASE_NAME = "vehicle-sale-database";
const DATABASE_VERSION = 1;
const ANNOUNCEMENTS_STORE = "announcements";

function openDatabase() {
  if (!("indexedDB" in globalThis)) {
    return Promise.reject(
      new Error("Este navegador não oferece suporte ao armazenamento de imagens.")
    );
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      request.result.createObjectStore(ANNOUNCEMENTS_STORE, {
        keyPath: "id",
      });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      reject(
        request.error ??
          new Error("Não foi possível abrir o armazenamento do navegador.")
      );
    };
    request.onblocked = () => {
      reject(
        new Error("Feche outras abas do projeto para atualizar o armazenamento.")
      );
    };
  });
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      reject(
        request.error ??
          new Error("Não foi possível acessar os dados armazenados.")
      );
    };
  });
}

function transactionResult(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = resolve;
    transaction.onabort = () => {
      reject(
        transaction.error ??
          new Error("O navegador cancelou a gravação dos dados.")
      );
    };
    transaction.onerror = () => {
      reject(
        transaction.error ??
          new Error("Não foi possível concluir a gravação dos dados.")
      );
    };
  });
}

async function withStore(mode, operation) {
  const database = await openDatabase();
  const transaction = database.transaction(ANNOUNCEMENTS_STORE, mode);
  const completed = transactionResult(transaction);

  try {
    const result = await operation(transaction.objectStore(ANNOUNCEMENTS_STORE));
    await completed;
    return result;
  } catch (error) {
    try {
      transaction.abort();
    } catch {
      // The transaction may already have completed or aborted.
    }

    await completed.catch(() => {});
    throw error;
  } finally {
    database.close();
  }
}

function isValidPurchaseDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function normalizeAnnouncement(value) {
  if (
    !value ||
    typeof value !== "object" ||
    typeof value.id !== "string" ||
    typeof value.createdAt !== "string" ||
    Number.isNaN(Date.parse(value.createdAt)) ||
    typeof value.title !== "string" ||
    typeof value.price !== "string" ||
    !/^\d+(?:\.\d{1,2})?$/.test(value.price) ||
    !Number.isFinite(Number(value.price)) ||
    Number(value.price) <= 0 ||
    typeof value.description !== "string" ||
    value.description.trim().length === 0 ||
    value.description.trim().length > 2000 ||
    typeof value.brand !== "string" ||
    value.brand.trim().length === 0 ||
    value.brand.trim().length > 50 ||
    typeof value.model !== "string" ||
    value.model.trim().length === 0 ||
    value.model.trim().length > 50 ||
    typeof value.mileage !== "string" ||
    !/^\d+$/.test(value.mileage) ||
    !Number.isSafeInteger(Number(value.mileage)) ||
    value.title.trim().length < 3 ||
    value.title.trim().length > 30 ||
    !isValidPurchaseDate(value.purchase_date) ||
    !["manual", "automatic"].includes(value.gear) ||
    !Array.isArray(value.optionals) ||
    !value.optionals.every((item) => typeof item === "string") ||
    !Array.isArray(value.photos)
  ) {
    throw new Error(
      "Há um anúncio salvo em formato inválido. Os outros dados não foram alterados."
    );
  }

  const photos = value.photos.map((photo, index) => {
    if (typeof photo === "string") {
      return {
        id: `${value.id}-photo-${index}`,
        name: photo,
        type: "",
        size: 0,
      };
    }

    if (
      !photo ||
      typeof photo !== "object" ||
      typeof photo.name !== "string" ||
      typeof photo.id !== "string" ||
      typeof photo.type !== "string" ||
      typeof photo.size !== "number" ||
      photo.size < 0 ||
      (photo.blob === undefined && (photo.type !== "" || photo.size !== 0)) ||
      (photo.blob !== undefined &&
        (!(photo.blob instanceof Blob) ||
          !["image/jpeg", "image/png", "image/webp"].includes(photo.type) ||
          photo.size > MAX_PHOTO_SIZE_BYTES))
    ) {
      throw new Error(
        "Há uma foto salva em formato inválido. Os outros dados não foram alterados."
      );
    }

    return photo;
  });

  if (
    photos.length === 0 ||
    (photos.some((photo) => photo.blob instanceof Blob) &&
      (photos.length > MAX_PHOTO_COUNT ||
        photos.some((photo) => !(photo.blob instanceof Blob))))
  ) {
    throw new Error(
      "Há um anúncio salvo em formato inválido. Os outros dados não foram alterados."
    );
  }

  return { ...value, photos };
}

function readLegacyAnnouncements() {
  const storedValue = localStorage.getItem(VEHICLE_STORAGE_KEY);
  if (storedValue === null) {
    return [];
  }

  let announcements;
  try {
    announcements = JSON.parse(storedValue);
  } catch {
    throw new Error(
      "Os anúncios antigos estão corrompidos. Eles não foram removidos."
    );
  }

  if (!Array.isArray(announcements)) {
    throw new Error(
      "Os anúncios antigos estão em um formato inválido. Eles não foram removidos."
    );
  }

  return announcements.map(normalizeAnnouncement);
}

export async function getAnnouncements() {
  const storedAnnouncements = await withStore("readonly", async (store) =>
    requestResult(store.getAll())
  );

  if (storedAnnouncements.length > 0) {
    return storedAnnouncements
      .map(normalizeAnnouncement)
      .sort((first, second) => first.createdAt.localeCompare(second.createdAt));
  }

  const legacyAnnouncements = readLegacyAnnouncements();
  if (legacyAnnouncements.length === 0) {
    return [];
  }

  await withStore("readwrite", async (store) => {
    await Promise.all(
      legacyAnnouncements.map((announcement) =>
        requestResult(store.put(announcement))
      )
    );
  });

  localStorage.removeItem(VEHICLE_STORAGE_KEY);
  return legacyAnnouncements.sort((first, second) =>
    first.createdAt.localeCompare(second.createdAt)
  );
}

export async function saveAnnouncement(announcement, photos) {
  const photoErrors = validatePhotos(photos);
  if (photoErrors.length > 0) {
    throw new Error(photoErrors[0]);
  }

  const id =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const savedAnnouncement = {
    ...announcement,
    id,
    createdAt: new Date().toISOString(),
    photos: photos.map((photo, index) => ({
      id: `${id}-photo-${index}`,
      name: photo.name,
      type: photo.type,
      size: photo.size,
      blob: photo,
    })),
  };

  await withStore("readwrite", (store) =>
    requestResult(store.add(savedAnnouncement))
  );

  return savedAnnouncement;
}
