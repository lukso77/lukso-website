const TEXT = 'Lo Premium ✦ A Tu Precio ✦ Originales Garantizados ✦ Medellín · Colombia ✦ @LUKSO.COL \u00A0\u00A0'
const track = TEXT.repeat(6)

export default function MarqueeStrip() {
  return (
    <div
      className="overflow-hidden py-4"
      style={{ background: 'var(--neon)' }}
      aria-label="Lo Premium · A Tu Precio · Originales Garantizados · Medellín Colombia · @LUKSO.COL"
    >
      <div className="marquee-track" aria-hidden="true">
        <p
          className="whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: 'var(--bg)',
            textTransform: 'uppercase',
          }}
        >
          {track}
        </p>
      </div>
    </div>
  )
}
