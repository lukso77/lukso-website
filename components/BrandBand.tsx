import { brands } from '@/data/products'

// Duplicate for seamless loop
const track = [...brands, ...brands, ...brands]

export default function BrandBand() {
  return (
    <section
      id="marcas"
      className="overflow-hidden py-6 relative"
      style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
      aria-label="Marcas disponibles"
    >
      {/* Fade edges */}
      <div
        className="absolute left-0 top-0 h-full w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--bg), transparent)' }}
        aria-hidden="true"
      />
      <div
        className="absolute right-0 top-0 h-full w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, var(--bg), transparent)' }}
        aria-hidden="true"
      />

      <div className="marquee-track" aria-hidden="true">
        {track.map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="whitespace-nowrap mx-8 flex items-center gap-4"
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.65rem',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            {brand}
            <span style={{ color: 'var(--neon)', opacity: 0.4 }}>✦</span>
          </span>
        ))}
      </div>
    </section>
  )
}
