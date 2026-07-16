import { SYSTEM_INFO, TANISH_ASCII, THEME_SWATCHES } from "./constants";

export function TanishAscii() {
  return (
    <pre
      className="text-primary-200 font-ipa-gothic text-[8px] sm:text-[9px] md:text-[10px] leading-[1.15] select-none whitespace-pre overflow-hidden shrink-0"
      aria-hidden="true"
    >
      {TANISH_ASCII}
    </pre>
  );
}

export function SystemCard() {
  return (
    <div className="min-w-0">
      <div className="text-teritiary-700 font-medium">tanish@portfolio</div>
      <div className="text-teritiary-200 mb-2">----------------</div>
      <div className="space-y-0.5">
        {SYSTEM_INFO.map((row) => (
          <div
            key={row.label}
            className="flex gap-x-2 min-w-0 text-[13px] sm:text-sm"
          >
            <span className="text-primary-200 w-[4.8rem] shrink-0">
              {row.label}
            </span>
            <span className="text-teritiary-600 truncate">{row.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1" aria-hidden="true">
        {THEME_SWATCHES.map((c) => (
          <span
            key={c}
            className="size-2.5 rounded-sm border border-secondary-600"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
}
