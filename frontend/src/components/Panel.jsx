export function Panel({ title, action, className = '', children }) {
  return (
    <section className={`panel ${className}`}>
      <header className="panel-header">
        <h2>{title}</h2>
        {action ? <span>{action}</span> : null}
      </header>
      {children}
    </section>
  );
}
