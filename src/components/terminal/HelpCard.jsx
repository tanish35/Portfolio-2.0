import { HELP_FUN, HELP_SECTIONS } from "./constants";

export function HelpCard() {
  return (
    <div className="space-y-3 text-sm">
      {HELP_SECTIONS.map((sec) => (
        <div key={sec.title}>
          <div className="text-primary-300 uppercase tracking-wider text-xs mb-1">
            {sec.title}
          </div>
          {sec.commands.map(([cmd, desc]) => (
            <div key={cmd} className="flex gap-x-4">
              <span className="text-teritiary-600 whitespace-nowrap min-w-[9rem]">
                {cmd}
              </span>
              <span className="text-teritiary-400">{desc}</span>
            </div>
          ))}
        </div>
      ))}

      <div>
        <div className="text-primary-300 uppercase tracking-wider text-xs mb-1">
          Fun / easter eggs
        </div>
        {HELP_FUN.map((line) => (
          <div key={line} className="text-teritiary-400">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
