import HeroField from "./HeroField";
import ServiceMark from "./ServiceMark";

const visuals = {
  services: {
    service: { slug: "ai-web-product", title: "AI web product", side: "ai" },
    signal: "DISCOVER / ENGINEER / DELIVER",
    metric: "08 disciplines · 48 offerings",
  },
  web: {
    service: {
      slug: "web-development",
      title: "Full-stack web application",
      side: "web",
    },
    signal: "INTERFACE / SYSTEM / PRODUCT",
    metric: "Built around your requirements",
  },
  ai: {
    service: {
      slug: "ai-development",
      title: "AI model development",
      side: "ai",
    },
    signal: "RESEARCH / MODEL / INTELLIGENCE",
    metric: "Applied AI, thoughtfully engineered",
  },
  research: {
    service: {
      slug: "research-ml-experimentation",
      title: "Research ML experimentation",
      side: "ai",
    },
    signal: "QUESTION / EXPERIMENT / INSIGHT",
    metric: "Evidence-led, technically grounded",
  },
  automation: {
    service: { slug: "automation", title: "Automation workflow", side: "web" },
    signal: "CONNECT / ORCHESTRATE / IMPROVE",
    metric: "Systems that work together",
  },
  design: {
    service: { slug: "ui-ux-engineering", title: "UI UX design", side: "web" },
    signal: "UNDERSTAND / DESIGN / REFINE",
    metric: "Clear by design, built to work",
  },
  student: {
    service: {
      slug: "research-ml-experimentation",
      title: "Student research ML",
      side: "ai",
    },
    signal: "LEARN / EXPERIMENT / BUILD",
    metric: "25% offer · after verification",
  },
  project: {
    service: {
      slug: "ai-web-product",
      title: "AI product engineering",
      side: "ai",
    },
    signal: "SCOPE / ESTIMATE / BUILD",
    metric: "One brief · connected disciplines",
  },
  contact: {
    service: {
      slug: "automation",
      title: "Connected project conversation",
      side: "web",
    },
    signal: "LISTEN / ALIGN / BEGIN",
    metric: "Your project, thoughtfully considered",
  },
  track: {
    service: {
      slug: "backend-api-development",
      title: "API software system",
      side: "web",
    },
    signal: "REQUEST / REVIEW / PROGRESS",
    metric: "A clear view of what comes next",
  },
  admin: {
    service: {
      slug: "dashboard-development",
      title: "Product operations dashboard",
      side: "web",
    },
    signal: "REVIEW / COORDINATE / DELIVER",
    metric: "Sparse.lab operations",
  },
};

export default function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  kind = "project",
  actions,
  meta,
  compact = false,
}) {
  const visual = visuals[kind] || visuals.project;
  const headingSize =
    kind === "services"
      ? "text-[clamp(2.8rem,5vw,4.5rem)]"
      : "text-[clamp(2.8rem,5.5vw,4.9rem)]";

  return (
    <section
      className={`relative isolate flex min-h-[430px] w-[calc(100%+56px)] -mx-7 -mt-[132px] mb-12 flex-col justify-center overflow-hidden border-b border-white/[0.08] bg-[radial-gradient(ellipse_at_50%_46%,rgba(34,76,124,0.13),transparent_48%),#020305] pb-[35px] pt-[126px] ${compact ? "min-h-[340px]" : ""} max-[900px]:min-h-[390px] max-[760px]:mb-8 max-[760px]:min-h-0 max-[760px]:-mx-5 max-[760px]:w-[calc(100%+40px)] max-[760px]:-mt-[103px] max-[760px]:pb-[21px] max-[760px]:pt-[99px] max-[480px]:-mt-[103px] max-[480px]:mb-8 max-[480px]:pt-[91px]`}
    >
      <HeroField className="pointer-events-none absolute inset-0 h-full w-full opacity-50" />
      <div className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-lab-blue/[0.07] blur-[100px]" />
      <div className="pointer-events-none absolute -right-12 top-1/3 h-64 w-64 rounded-full bg-lab-gold/[0.06] blur-[100px]" />
      <div className="relative z-10 mx-auto grid min-h-[300px] w-full max-w-page grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] items-center gap-7 px-7 max-[900px]:grid-cols-[minmax(0,1fr)_300px] max-[900px]:gap-3 max-[760px]:grid-cols-1 max-[760px]:gap-2 max-[760px]:text-center">
        <div className="max-w-[650px]">
          <p className="mb-[17px] inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.15em] text-lab-gold max-[760px]:justify-center">
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lab-blue shadow-[0_0_12px_rgba(76,151,244,0.75)] before:absolute before:-inset-1 before:rounded-full before:bg-lab-blue/20 before:content-['']" />
            {eyebrow}
          </p>
          <h1
            className={`m-0 max-w-[720px] font-display ${headingSize} font-semibold leading-[1.01] tracking-[-0.055em] text-[#f4f5f8] max-[900px]:text-[clamp(2.6rem,5vw,4rem)] max-[760px]:mx-auto max-[760px]:text-[clamp(2.55rem,9vw,3.7rem)] max-[480px]:text-[clamp(2.4rem,10vw,3.2rem)]`}
          >
            {title}
            {highlight && (
              <>
                {" "}
                <span className="bg-gradient-to-r from-[#f0d37c] via-[#d7deeb] to-[#77adfa] bg-clip-text text-transparent">
                  {highlight}
                </span>
              </>
            )}
          </h1>
          {description && (
            <p className="mt-[19px] max-w-[600px] text-[0.98rem] leading-[1.75] text-[#a7adbd] max-[760px]:mx-auto max-[760px]:mt-[15px] max-[760px]:text-[0.9rem]">
              {description}
            </p>
          )}
          {actions && (
            <div className="mt-6 flex flex-wrap items-center gap-3 max-[760px]:justify-center max-[480px]:gap-2">
              {actions}
            </div>
          )}
          {meta && (
            <p className="mt-[17px] inline-flex items-center gap-2 rounded-full border border-lab-gold/20 bg-lab-gold/[0.045] px-3 py-1.5 text-xs text-[#d7c78f] max-[760px]:mt-[13px]">
              {meta}
            </p>
          )}
        </div>
        <div
          className="relative mx-auto grid h-[300px] w-full max-w-[390px] place-items-center max-[900px]:h-[270px] max-[900px]:w-[300px] max-[760px]:h-[225px] max-[760px]:w-[min(320px,100%)] max-[480px]:h-[206px]"
          role="img"
          aria-label="Research, intelligence, engineering and product workflow"
        >
          <div className="absolute h-[82%] w-[82%] rounded-full border border-lab-blue/20 animate-[spin_28s_linear_infinite] after:absolute after:left-[18%] after:top-[7%] after:h-1 after:w-1 after:rounded-full after:bg-lab-blue after:shadow-[0_0_10px_rgba(76,151,244,0.8)] after:content-[''] motion-reduce:animate-none" />
          <div className="absolute h-[65%] w-[65%] rotate-45 rounded-[34%] border border-lab-gold/20 animate-[spin_34s_linear_infinite_reverse] motion-reduce:animate-none" />
          <div className="relative z-[1] grid h-[176px] w-[176px] place-items-center rounded-full border border-lab-blue/20 bg-[radial-gradient(circle,rgba(15,28,48,0.96),rgba(3,5,10,0.95)_70%)] shadow-[0_0_50px_rgba(49,118,185,0.12),inset_0_0_25px_rgba(76,151,244,0.05)] before:absolute before:inset-[13px] before:rounded-full before:border before:border-lab-gold/[0.12] before:content-[''] max-[760px]:h-[140px] max-[760px]:w-[140px]">
            <ServiceMark service={visual.service} />
            <span className="absolute bottom-5 max-w-[140px] text-center text-[0.48rem] uppercase leading-[1.4] tracking-[0.12em] text-[#9ea6ba] max-[760px]:bottom-4 max-[760px]:max-w-[115px]">
              {visual.metric}
            </span>
          </div>
          <div className="absolute left-1/2 top-[11%] flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap text-[0.48rem] font-medium uppercase tracking-[0.14em] text-[#aeb4c3]">
            <span className="h-1 w-1 rounded-full bg-lab-blue" />
            <span className="h-1 w-1 rounded-full bg-lab-gold" />
            <span className="h-1 w-1 rounded-full bg-lab-blue" />
            {visual.signal}
          </div>
          {[
            ["01", "Research", "left-1/2 top-[19%] -translate-x-1/2"],
            ["02", "Intelligence", "right-[2%] top-1/2 -translate-y-1/2"],
            ["03", "Engineering", "bottom-[15%] left-1/2 -translate-x-1/2"],
            ["04", "Product", "left-[2%] top-1/2 -translate-y-1/2"],
          ].map(([number, label, position]) => (
            <div
              key={number}
              className={`absolute z-[2] flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#05070c]/80 px-2 py-1 text-[0.52rem] text-[#aeb4c3] backdrop-blur-sm ${position}`}
            >
              <span className="font-mono text-[0.47rem] text-lab-gold">
                {number}
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-[1] mx-auto flex w-full max-w-page items-center justify-between gap-3 px-7 pt-3 text-[0.56rem] font-medium uppercase tracking-[0.13em] text-[#7d8497] max-[480px]:px-5 max-[480px]:text-[0.46rem]">
        <span className="max-[480px]:max-w-[50%] max-[480px]:leading-[1.4]">
          SPARSE.LAB / DIGITAL ENGINEERING
        </span>
        <span className="flex items-center gap-2 max-[480px]:gap-[5px]">
          IDEA <i className="h-[3px] w-[3px] rounded-full bg-lab-gold" /> SYSTEM{" "}
          <i className="h-[3px] w-[3px] rounded-full bg-lab-gold" /> OUTCOME
        </span>
      </div>
    </section>
  );
}
