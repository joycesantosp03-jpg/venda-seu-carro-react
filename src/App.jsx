import { useCallback, useEffect, useRef, useState } from "react";
import Header from "./components/Header.jsx";
import VehicleAnnouncements from "./components/VehicleAnnouncements.jsx";
import VehicleForm from "./components/VehicleForm.jsx";
import WelcomeScreen from "./components/WelcomeScreen.jsx";
import { getAnnouncements } from "./services/vehicleStorage.js";

function addPhotoUrls(announcement, ownedPhotoUrls) {
  return {
    ...announcement,
    photos: announcement.photos.map((photo) => {
      const displayUrl =
        photo.blob instanceof Blob ? URL.createObjectURL(photo.blob) : null;

      if (displayUrl) {
        ownedPhotoUrls.add(displayUrl);
      }

      return { ...photo, displayUrl };
    }),
  };
}

function revokePhotoUrls(ownedPhotoUrls) {
  ownedPhotoUrls.forEach((url) => URL.revokeObjectURL(url));
  ownedPhotoUrls.clear();
}

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [activeView, setActiveView] = useState("form");
  const [announcements, setAnnouncements] = useState([]);
  const [storageStatus, setStorageStatus] = useState("idle");
  const [storageError, setStorageError] = useState("");
  const ownedPhotoUrls = useRef(new Set());

  const loadAnnouncements = useCallback(async () => {
    setStorageStatus("loading");
    setStorageError("");

    try {
      const savedAnnouncements = await getAnnouncements();
      revokePhotoUrls(ownedPhotoUrls.current);
      setAnnouncements(
        savedAnnouncements.map((announcement) =>
          addPhotoUrls(announcement, ownedPhotoUrls.current)
        )
      );
      setStorageStatus("ready");
    } catch (error) {
      console.error("Não foi possível carregar os anúncios:", error);
      revokePhotoUrls(ownedPhotoUrls.current);
      setAnnouncements([]);
      setStorageError(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os anúncios salvos."
      );
      setStorageStatus("error");
    }
  }, []);

  useEffect(() => {
    const photoUrls = ownedPhotoUrls.current;
    return () => revokePhotoUrls(photoUrls);
  }, []);

  if (!hasStarted) {
    return (
      <WelcomeScreen
        onStart={() => {
          setHasStarted(true);
          void loadAnnouncements();
        }}
      />
    );
  }

  function handleViewChange(view) {
    setActiveView(view);
    if (view === "announcements") {
      void loadAnnouncements();
    }
  }

  function handleAnnouncementSaved(announcement) {
    const displayAnnouncement = addPhotoUrls(
      announcement,
      ownedPhotoUrls.current
    );
    setAnnouncements((previousAnnouncements) => [
      ...previousAnnouncements,
      displayAnnouncement,
    ]);
    setStorageStatus("ready");
  }

  return (
    <div className="container">
      <Header />
      <nav className="app-navigation" aria-label="Navegação de anúncios">
        <button
          type="button"
          aria-current={activeView === "form" ? "page" : undefined}
          className="view-tab"
          onClick={() => handleViewChange("form")}
        >
          Cadastrar anúncio
        </button>
        <button
          type="button"
          aria-current={activeView === "announcements" ? "page" : undefined}
          className="view-tab"
          onClick={() => handleViewChange("announcements")}
        >
          {`${announcements.length === 1 ? "Anúncio salvo" : "Anúncios salvos"} (${announcements.length})`}
        </button>
      </nav>
      <main
        id="app-panel"
        className="app-panel"
        aria-label={activeView === "form" ? "Cadastro de anúncio" : "Anúncios salvos"}
      >
        {activeView === "form" ? (
          <VehicleForm onSaved={handleAnnouncementSaved} />
        ) : storageStatus === "loading" ? (
          <p className="storage-message" role="status">
            Carregando anúncios salvos...
          </p>
        ) : storageStatus === "error" ? (
          <div className="storage-message" role="alert">
            <p>{storageError}</p>
            <button
              type="button"
              className="btn-submit storage-retry"
              onClick={() => void loadAnnouncements()}
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <VehicleAnnouncements
            announcements={announcements}
            onCreate={() => handleViewChange("form")}
          />
        )}
      </main>
    </div>
  );
}
