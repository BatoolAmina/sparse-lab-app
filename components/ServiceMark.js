const categories = {
  ai: { label: "AI systems", code: "MODEL GRAPH / 01" },
  web: { label: "Software engineering", code: "APPLICATION / 02" },
  hybrid: { label: "AI + product", code: "CONNECTED SYSTEM / 03" },
  research: { label: "Research & ML", code: "RESEARCH NODE / 04" },
  automation: { label: "Automation", code: "WORKFLOW / 05" },
  design: { label: "UI/UX engineering", code: "INTERFACE / 06" },
};

export function getServiceCategory(service) {
  const text = `${service.slug || ""} ${service.title || ""}`.toLowerCase();
  const hasAI =
    /\b(ai|artificial intelligence|ml|machine learning|llm|nlp|chatbot|computer vision|model)\b/.test(
      text,
    );
  const hasWeb =
    /\b(web|website|app|application|software|saas|backend|api|dashboard|authentication|frontend|full-stack)\b/.test(
      text,
    );

  if (hasAI && hasWeb) return "hybrid";
  if (
    /\b(research|experimentation|paper|documentation|evaluation)\b/.test(text)
  )
    return "research";
  if (/\b(automation|workflow)\b/.test(text)) return "automation";
  if (/\b(ui.?ux|design|interface)\b/.test(text)) return "design";
  if (hasAI || service.side === "ai") return "ai";
  return "web";
}

export default function ServiceMark({ service, compact = false }) {
  const category = getServiceCategory(service);
  const compactStyle = compact
    ? "h-9 w-[43px] flex-[0_0_43px] grid-rows-1 before:inset-[4px_2px_7px]"
    : "mb-[10px] h-24 w-[122px] grid-rows-[1fr_auto] before:inset-[14px_7px_20px]";
  const frameStyle =
    category === "design" || category === "hybrid"
      ? "stroke-[rgba(233,198,109,0.66)]"
      : "stroke-[rgba(132,157,205,0.68)]";

  return (
    <span
      className={`group/mark relative isolate grid ${compactStyle} items-center text-lab-blue before:absolute before:-z-10 before:rounded-full before:bg-[radial-gradient(ellipse,rgba(76,151,244,0.12),transparent_68%)] before:opacity-65 before:transition before:duration-300 group-hover/mark:before:scale-110 group-hover/mark:before:opacity-100`}
      aria-hidden="true"
    >
      <svg
        className={`${compact ? "h-[29px]" : "h-[74px]"} block w-full overflow-visible`}
        viewBox="0 0 120 82"
        fill="none"
        focusable="false"
      >
        {category === "ai" && (
          <>
            <path
              className="fill-none stroke-[rgba(132,157,205,0.55)] [stroke-width:1.35] [stroke-linecap:round] [stroke-linejoin:round] transition-colors group-hover/mark:stroke-[rgba(132,183,255,0.95)]"
              d="M22 18 48 35M22 64l26-17M48 35l24-17M48 47l24 17M48 35v12m24-29 27 14M72 64l27-14M72 41l27 9"
            />
            <circle
              className="fill-[#11182b] stroke-[rgba(119,173,250,0.85)] [stroke-width:1.35] transition-all group-hover/mark:fill-[#182847] group-hover/mark:drop-shadow-[0_0_4px_rgba(76,151,244,0.45)]"
              cx="22"
              cy="18"
              r="4"
            />
            <circle
              className="fill-[#11182b] stroke-[rgba(119,173,250,0.85)] [stroke-width:1.35] transition-all group-hover/mark:fill-[#182847] group-hover/mark:drop-shadow-[0_0_4px_rgba(76,151,244,0.45)]"
              cx="22"
              cy="64"
              r="4"
            />
            <circle
              className="fill-[#d7bc71] stroke-[#f0d681] [stroke-width:1.35] transition-all group-hover/mark:fill-[#f0d681] group-hover/mark:drop-shadow-[0_0_5px_rgba(233,198,109,0.75)]"
              cx="48"
              cy="35"
              r="5"
            />
            <circle
              className="fill-[#11182b] stroke-[rgba(119,173,250,0.85)] [stroke-width:1.35] transition-all group-hover/mark:fill-[#182847]"
              cx="48"
              cy="47"
              r="4"
            />
            <circle
              className="fill-[#11182b] stroke-[rgba(119,173,250,0.85)] [stroke-width:1.35] transition-all group-hover/mark:fill-[#182847]"
              cx="72"
              cy="18"
              r="4"
            />
            <circle
              className="fill-[#d7bc71] stroke-[#f0d681] [stroke-width:1.35] transition-all group-hover/mark:fill-[#f0d681] group-hover/mark:drop-shadow-[0_0_5px_rgba(233,198,109,0.75)]"
              cx="72"
              cy="64"
              r="5"
            />
            <circle
              className="fill-[#11182b] stroke-[rgba(119,173,250,0.85)] [stroke-width:1.35] transition-all group-hover/mark:fill-[#182847]"
              cx="99"
              cy="32"
              r="4"
            />
            <circle
              className="fill-[#11182b] stroke-[rgba(119,173,250,0.85)] [stroke-width:1.35] transition-all group-hover/mark:fill-[#182847]"
              cx="99"
              cy="50"
              r="4"
            />
          </>
        )}
        {category === "web" && (
          <>
            <rect
              className={`fill-[rgba(21,29,51,0.42)] ${frameStyle} [stroke-width:1.35]`}
              x="19"
              y="13"
              width="82"
              height="56"
              rx="7"
            />
            <path
              className="fill-none stroke-[rgba(132,157,205,0.55)] [stroke-width:1.35] [stroke-linecap:round] [stroke-linejoin:round] transition-colors group-hover/mark:stroke-[rgba(132,183,255,0.95)]"
              d="M19 26h82M29 20h.1M36 20h.1M43 20h.1M48 39l-9 7 9 7m24-14 9 7-9 7m-7-16-5 18"
            />
            <path
              className="stroke-[#d7bc71] [stroke-width:1.55] [stroke-linecap:round] transition-colors"
              d="M86 42h7m-7 8h7"
            />
          </>
        )}
        {category === "hybrid" && (
          <>
            <path
              className="fill-none stroke-[rgba(132,157,205,0.55)] [stroke-width:1.35] [stroke-linecap:round] [stroke-linejoin:round] transition-colors group-hover/mark:stroke-[rgba(132,183,255,0.95)]"
              d="M17 23h19l12 18h17l12-18h26M17 59h19l12-18m17 0 12 18h26"
            />
            <circle
              className="fill-[#11182b] stroke-[rgba(119,173,250,0.85)] [stroke-width:1.35]"
              cx="17"
              cy="23"
              r="4"
            />
            <circle
              className="fill-[#11182b] stroke-[rgba(119,173,250,0.85)] [stroke-width:1.35]"
              cx="17"
              cy="59"
              r="4"
            />
            <circle
              className="fill-[#d7bc71] stroke-[#f0d681] [stroke-width:1.35] transition-all group-hover/mark:drop-shadow-[0_0_5px_rgba(233,198,109,0.75)]"
              cx="48"
              cy="41"
              r="5"
            />
            <circle
              className="fill-[#11182b] stroke-[rgba(119,173,250,0.85)] [stroke-width:1.35]"
              cx="65"
              cy="41"
              r="4"
            />
            <rect
              className={`fill-[rgba(21,29,51,0.42)] ${frameStyle} [stroke-width:1.35]`}
              x="82"
              y="15"
              width="24"
              height="50"
              rx="4"
            />
            <path
              className="stroke-[#d7bc71] [stroke-width:1.55] [stroke-linecap:round]"
              d="M88 29h12m-12 7h12m-12 16h7"
            />
          </>
        )}
        {category === "research" && (
          <>
            <path
              className="fill-none stroke-[rgba(132,157,205,0.55)] [stroke-width:1.35] [stroke-linecap:round] [stroke-linejoin:round]"
              d="M18 62h84M24 56V43h12v13m9 0V31h12v25m9 0V39h12v17m9 0V22h12v34"
            />
            <path
              className="fill-none stroke-[rgba(233,198,109,0.74)] [stroke-width:1.35] [stroke-dasharray:4_5]"
              d="m24 34 21-10 17 8 20-17 17 5"
            />
            <circle
              className="fill-[#d7bc71] stroke-[#f0d681] [stroke-width:1.35]"
              cx="45"
              cy="24"
              r="3.5"
            />
            <circle
              className="fill-[#11182b] stroke-[rgba(119,173,250,0.85)] [stroke-width:1.35]"
              cx="62"
              cy="32"
              r="3.5"
            />
            <circle
              className="fill-[#d7bc71] stroke-[#f0d681] [stroke-width:1.35]"
              cx="82"
              cy="15"
              r="3.5"
            />
          </>
        )}
        {category === "automation" && (
          <>
            <path
              className="fill-none stroke-[rgba(233,198,109,0.74)] [stroke-width:1.35] [stroke-dasharray:4_5] [stroke-linecap:round] [stroke-linejoin:round]"
              d="M23 21h22v20h28V21h24m-74 20v20h22m28-20v20h24"
            />
            <rect
              className="fill-[#11182b] stroke-[rgba(119,173,250,0.85)] [stroke-width:1.35]"
              x="17"
              y="15"
              width="12"
              height="12"
              rx="3"
            />
            <rect
              className="fill-[#d7bc71] stroke-[#f0d681] [stroke-width:1.35]"
              x="39"
              y="35"
              width="12"
              height="12"
              rx="3"
            />
            <rect
              className="fill-[#11182b] stroke-[rgba(119,173,250,0.85)] [stroke-width:1.35]"
              x="67"
              y="15"
              width="12"
              height="12"
              rx="3"
            />
            <rect
              className="fill-[#11182b] stroke-[rgba(119,173,250,0.85)] [stroke-width:1.35]"
              x="39"
              y="55"
              width="12"
              height="12"
              rx="3"
            />
            <rect
              className="fill-[#d7bc71] stroke-[#f0d681] [stroke-width:1.35]"
              x="91"
              y="15"
              width="12"
              height="12"
              rx="3"
            />
            <rect
              className="fill-[#11182b] stroke-[rgba(119,173,250,0.85)] [stroke-width:1.35]"
              x="91"
              y="55"
              width="12"
              height="12"
              rx="3"
            />
          </>
        )}
        {category === "design" && (
          <>
            <rect
              className={`fill-[rgba(21,29,51,0.42)] ${frameStyle} [stroke-width:1.35]`}
              x="17"
              y="14"
              width="75"
              height="54"
              rx="6"
            />
            <path
              className="fill-none stroke-[rgba(132,157,205,0.55)] [stroke-width:1.35] [stroke-linecap:round] [stroke-linejoin:round]"
              d="M17 27h75m-62 9h25v23H30zm34 0h18m-18 7h18m-18 7h12"
            />
            <path
              className="stroke-[#d7bc71] [stroke-width:1.55] [stroke-linecap:round]"
              d="m97 45 9 20-7-3-4 7-7-20z"
            />
            <circle
              className="fill-[#d7bc71] stroke-[#f0d681] [stroke-width:1.35]"
              cx="23"
              cy="20.5"
              r="1.5"
            />
          </>
        )}
      </svg>
      {!compact && (
        <span className="justify-self-center whitespace-nowrap text-center text-[0.53rem] font-semibold leading-tight tracking-[0.12em] text-[#707b9b]">
          {categories[category].code}
        </span>
      )}
    </span>
  );
}
