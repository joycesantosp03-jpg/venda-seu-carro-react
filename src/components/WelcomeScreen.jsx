export default function WelcomeScreen({ onStart }) {
  return (
    <main className="welcome-screen">
      <div className="welcome-shell">
        <header className="welcome-header">
          <p className="brand-lockup">
            <span className="brand-mark" aria-hidden="true">V</span>
            <span>VENDA <strong>SEU CARRO</strong></span>
          </p>
          <span className="welcome-edition">CLASSIFICADOS DE VEÍCULOS</span>
        </header>

        <section className="welcome-hero">
          <div className="welcome-copy">
            <p className="welcome-eyebrow">ANÚNCIOS DE VEÍCULOS</p>
            <h1>
              <button className="welcome-action" type="button" onClick={onStart}>
                <span>Venda seu carro aqui</span>
                <span className="welcome-arrow" aria-hidden="true">↗</span>
              </button>
            </h1>
            <p className="welcome-description">
              Todo carro tem uma próxima história.
            </p>
            <p className="welcome-note">A SUA COMEÇA AGORA <span>01 / 01</span></p>
          </div>

          <figure className="welcome-visual">
            <img
              src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=85"
              alt="Automóvel esportivo fotografado de frente em um estacionamento"
              fetchPriority="high"
            />
            <figcaption>FOTO ILUSTRATIVA</figcaption>
          </figure>
        </section>

        <footer className="welcome-footer">
          <span>VENDA SEU CARRO</span>
          <span>BRASIL · 2026</span>
        </footer>
      </div>
    </main>
  );
}