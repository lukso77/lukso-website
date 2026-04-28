import { brands } from '@/data/products'

const navLinks = [
  { label: 'Catálogo',  href: '#catalogo' },
  { label: 'Marcas',    href: '#marcas' },
  { label: 'Nosotros',  href: '#nosotros' },
  { label: 'Contacto',  href: '#footer' },
]

const featuredBrands = ['Dior', 'Carolina Herrera', 'Versace', 'Lattafa', 'Montale', 'Paco Rabanne']

export default function Footer() {
  return (
    <footer
      id="footer"
      style={{
        background: '#080808',
        borderTop: '1px solid var(--border)',
      }}
    >
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-12">
        {/* Col 1 — Logo + tagline */}
        <div>
          <div className="flex items-center gap-0 mb-4">
            <span
              className="text-xl font-bold tracking-widest"
              style={{ fontFamily: 'var(--font-montserrat)', letterSpacing: '0.18em' }}
            >
              LK
            </span>
            <span
              className="text-xl font-bold tracking-widest"
              style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--neon)', letterSpacing: '0.18em' }}
            >
              SO
            </span>
          </div>
          <p
            className="leading-relaxed mb-6"
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.3)',
              maxWidth: '220px',
              lineHeight: 1.8,
            }}
          >
            Fragancias premium originales.<br />
            Medellín · Colombia · Est. 2026
          </p>
          <a
            href="https://www.instagram.com/lukso.col"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 group"
            aria-label="Instagram @LUKSO.COL"
          >
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ color: 'var(--neon)' }}
              aria-hidden="true"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            <span
              className="uppercase tracking-widest transition-colors group-hover:text-white"
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.18em',
              }}
            >
              @LUKSO.COL
            </span>
          </a>
        </div>

        {/* Col 2 — Navigation */}
        <div>
          <p
            className="uppercase tracking-widest mb-6"
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.2em',
            }}
          >
            Navegación
          </p>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-col gap-3">
              {navLinks.map(l => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="transition-colors hover:text-white"
                    style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontSize: '0.75rem',
                      color: 'rgba(255,255,255,0.3)',
                    }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Col 3 — Featured brands */}
        <div>
          <p
            className="uppercase tracking-widest mb-6"
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.2em',
            }}
          >
            Marcas destacadas
          </p>
          <ul className="flex flex-col gap-3">
            {featuredBrands.map(b => (
              <li key={b}>
                <a
                  href="#catalogo"
                  className="transition-colors hover:text-white"
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.3)',
                  }}
                >
                  {b}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.18)',
              letterSpacing: '0.12em',
            }}
          >
            © {new Date().getFullYear()} LUKSO. Todos los derechos reservados. Medellín, Colombia.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.6rem',
              color: 'rgba(200,255,0,0.4)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            @LUKSO.COL
          </p>
        </div>
      </div>
    </footer>
  )
}
