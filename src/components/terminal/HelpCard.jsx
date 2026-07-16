import { HELP_FUN, HELP_SECTIONS } from "./constants";

export function HelpCard() {
  return (
    <div className="help-card">
      <div className="help-grid">
        {HELP_SECTIONS.map((sec) => (
          <section key={sec.title} className="help-section">
            <h3 className="help-section-title">{sec.title}</h3>
            <dl className="help-rows">
              {sec.commands.map(([cmd, desc]) => (
                <div key={cmd} className="help-row">
                  <dt>{cmd}</dt>
                  <dd>{desc}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
      <div className="help-fun">
        <span className="help-fun-label">Fun / easter eggs</span>
        {HELP_FUN.map((line) => (
          <div key={line} className="help-fun-line">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
