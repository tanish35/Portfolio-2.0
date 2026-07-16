export function WhoamiReport({ report }) {
  if (!report) return null;
  return (
    <div className="whoami-report">
      <div className="whoami-hero">
        <div className="whoami-hero-mark" aria-hidden="true">
          ?
        </div>
        <div className="min-w-0">
          <div className="whoami-title">{report.title || "whoamireally"}</div>
          <div className="whoami-subtitle">
            {report.subtitle || "Browser session probe"}
          </div>
        </div>
      </div>

      {report.summary?.length > 0 && (
        <div className="whoami-summary">
          {report.summary.map((item) => (
            <div key={item.label} className="whoami-chip">
              <span className="whoami-chip-label">{item.label}</span>
              <span className="whoami-chip-value">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="whoami-grid">
        {(report.sections || []).map((sec) => (
          <section key={sec.id || sec.title} className="whoami-card">
            <header className="whoami-card-head">
              <span className="whoami-card-icon" aria-hidden="true">
                {sec.icon || "·"}
              </span>
              <h3 className="whoami-card-title">{sec.title}</h3>
            </header>
            <dl className="whoami-rows">
              {(sec.rows || []).map((row) => (
                <div key={`${sec.title}-${row.label}`} className="whoami-row">
                  <dt>{row.label}</dt>
                  <dd title={row.value}>{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      {report.footer && <p className="whoami-footer">{report.footer}</p>}
      {report.loading && (
        <p className="whoami-loading">Gathering extended signals…</p>
      )}
    </div>
  );
}
