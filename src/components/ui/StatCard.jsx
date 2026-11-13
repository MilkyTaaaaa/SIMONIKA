export default function StatCard({ label, value, unit, note, tone = 'plain', side }) {
  return (
    <article className={`stat stat--${tone}`}>
      <p className="stat__label">{label}</p>
      <div className="stat__row">
        <p className="stat__value">{value} {unit}</p>
        {side && <p className="stat__side">{side}</p>}
      </div>
      {note && <p className="stat__note">{note}</p>}
    </article>
  );
}
