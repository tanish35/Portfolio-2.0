export function WhoamiReport({ report }) {
  if (!report) return null;

  const sections = report.sections || [];
  const summary = report.summary || [];

  return (
    <div className="space-y-3 text-sm">
      <div>
        <div className="text-primary-200">{report.title || "whoamireally"}</div>
        <div className="text-teritiary-300 text-xs">
          {report.subtitle || "Browser session probe"}
        </div>
      </div>

      {summary.length > 0 && (
        <div>
          <div className="text-primary-300 uppercase tracking-wider text-xs mb-1">
            Session
          </div>
          {summary.map((item) => (
            <Row key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      )}

      {sections.map((sec) => (
        <div key={sec.id || sec.title}>
          <div className="text-primary-300 uppercase tracking-wider text-xs mb-1">
            {sec.title}
          </div>
          {(sec.rows || []).map((row) => (
            <Row
              key={`${sec.title}-${row.label}`}
              label={row.label}
              value={row.value}
            />
          ))}
        </div>
      ))}

      {report.footer && (
        <div className="text-teritiary-300 text-xs">{report.footer}</div>
      )}
      {report.loading && (
        <div className="text-primary-300 text-xs">
          Gathering extended signals…
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex gap-x-4">
      <span className="text-primary-300 whitespace-nowrap min-w-[8rem]">
        {label}
      </span>
      <span className="text-teritiary-500 break-all min-w-0">{value}</span>
    </div>
  );
}
