const OPTIONAL_LABELS = {
  "air-conditioning": "Ar condicionado",
  airbag: "Airbag",
  abs: "Freios ABS",
  "power-steering": "Direção hidráulica",
  "electric-windows": "Vidros elétricos",
  "electric-locks": "Travas elétricas",
  alarm: "Alarme",
  sound: "Som",
};
const EMPTY_PHOTOS = [];

function formatPurchaseDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR").format(
    new Date(year, month - 1, day)
  );
}

function formatPrice(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

function AnnouncementCard({ announcement }) {
  const photos = announcement.photos ?? EMPTY_PHOTOS;

  return (
    <li className="announcement-item">
      <div className="announcement-item-heading">
        <h2>{announcement.title}</h2>
        <p className="announcement-price">{formatPrice(announcement.price)}</p>
      </div>
      <dl className="announcement-details">
        <div>
          <dt>Marca e modelo</dt>
          <dd>
            {announcement.brand} {announcement.model}
          </dd>
        </div>
        <div>
          <dt>Quilometragem</dt>
          <dd>{Number(announcement.mileage).toLocaleString("pt-BR")} km</dd>
        </div>
        <div>
          <dt>Data de compra</dt>
          <dd>{formatPurchaseDate(announcement.purchase_date)}</dd>
        </div>
        <div>
          <dt>Câmbio</dt>
          <dd>
            {announcement.gear === "automatic" ? "Automático" : "Manual"}
          </dd>
        </div>
        <div>
          <dt>Fotos</dt>
          <dd>{photos.length}</dd>
        </div>
        {announcement.optionals.length > 0 && (
          <div>
            <dt>Opcionais</dt>
            <dd>
              {announcement.optionals
                .map((optional) => OPTIONAL_LABELS[optional] ?? optional)
                .join(", ")}
            </dd>
          </div>
        )}
      </dl>
      <p className="announcement-description">{announcement.description}</p>
      <div className="announcement-photos" aria-label="Fotos do veículo">
        {photos.map((photo, index) =>
          photo.displayUrl ? (
            <figure className="announcement-photo" key={photo.id}>
              <img
                src={photo.displayUrl}
                alt={`${announcement.title} — foto ${index + 1}`}
                loading="lazy"
              />
              <figcaption>{photo.name}</figcaption>
            </figure>
          ) : (
            <p className="legacy-photo-note" key={photo.id}>
              {photo.name}: imagem de um anúncio antigo não está disponível.
            </p>
          )
        )}
      </div>
    </li>
  );
}

export default function VehicleAnnouncements({ announcements, onCreate }) {
  return (
    <section className="form-container announcements-container">
      <div className="form-header">
        <p>Anúncios salvos</p>
      </div>
      <div className="form-body">
        <div className="announcements-heading">
          <h1 className="form-title">Seus anúncios</h1>
          <span
            className="announcement-count"
            aria-label={`${announcements.length} ${announcements.length === 1 ? "anúncio" : "anúncios"}`}
          >
            {announcements.length}
          </span>
        </div>

        {announcements.length === 0 ? (
          <div className="empty-announcements">
            <p>Nenhum anúncio salvo ainda.</p>
            <button type="button" className="btn-submit" onClick={onCreate}>
              Cadastrar anúncio
            </button>
          </div>
        ) : (
          <ul className="announcement-list">
            {announcements.map((announcement) => (
              <AnnouncementCard
                announcement={announcement}
                key={announcement.id}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
