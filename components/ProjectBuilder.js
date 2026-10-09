"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ServiceMark from "./ServiceMark";
import Link from "next/link";
import PageHero from "./PageHero";
import { getServiceGroups } from "../lib/service-groups";

const format = (value) => "₹" + Math.round(value).toLocaleString("en-IN");
const serviceCategories = [
  {
    id: "web",
    label: "Web & software",
    groupIds: ["web-development", "backend-product-engineering"],
  },
  {
    id: "ai",
    label: "AI & machine learning",
    groupIds: ["ai-development", "ai-web-products"],
  },
  {
    id: "research",
    label: "Research & technical",
    groupIds: ["research-ml", "technical-research-support"],
  },
  {
    id: "automation",
    label: "Automation & integrations",
    groupIds: ["automation-systems"],
  },
  {
    id: "design",
    label: "UI/UX & product design",
    groupIds: ["ui-ux-engineering"],
  },
];
const fieldClasses =
  "w-full rounded-[9px] border border-[#292e45] bg-[#090c17] px-[11px] py-[11px] text-[0.82rem] text-[#f1f2fa] placeholder:text-[#70768d] focus:border-[#4c97f4] focus:outline-none focus:ring-2 focus:ring-[#4c97f4]/30";
const fieldLabelClasses =
  "grid gap-1.5 text-[0.78rem] font-semibold text-[#d5d7e4]";
const stepClasses =
  "min-w-0 rounded-[13px] border border-[#20253b] bg-gradient-to-br from-[#090b10] to-[#06070a] p-6 min-[761px]:p-[30px]";
const stepTitleClasses = "mb-6 flex min-w-0 items-start gap-[15px]";
const stepNumberClasses =
  "grid h-[30px] w-[30px] flex-none place-items-center rounded-[9px] border border-[#e9c66d]/40 bg-[#e9c66d]/10 text-[0.7rem] font-bold text-[#e9c66d]";

export default function ProjectBuilder({
  services,
  adjustments,
  initialService = "",
  studentAuthorized = false,
}) {
  const router = useRouter();
  const [selection, setSelection] = useState(() =>
    services.some((service) => service.slug === initialService)
      ? [initialService]
      : [],
  );
  const [activeCategory, setActiveCategory] = useState(() =>
    services.find((service) => service.slug === initialService)?.side === "ai"
      ? "ai"
      : "web",
  );
  const [showAllServices, setShowAllServices] = useState(false);
  const [pages, setPages] = useState(1);
  const [selectedAdjustments, setSelectedAdjustments] = useState([]);
  const [timeline, setTimeline] = useState("flexible");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialService) return;
    try {
      const saved = JSON.parse(
        localStorage.getItem("sparse-project-draft") || "{}",
      );
      if (Array.isArray(saved.services))
        setSelection(
          saved.services.filter((slug) =>
            services.some((service) => service.slug === slug),
          ),
        );
      if (
        Number.isInteger(saved.pages) &&
        saved.pages >= 1 &&
        saved.pages <= 100
      )
        setPages(saved.pages);
      if (Array.isArray(saved.adjustments))
        setSelectedAdjustments(
          saved.adjustments.filter((id) =>
            adjustments.some((option) => option.id === id),
          ),
        );
    } catch {
      localStorage.removeItem("sparse-project-draft");
    }
  }, [initialService, services, adjustments]);
  useEffect(() => {
    localStorage.setItem(
      "sparse-project-draft",
      JSON.stringify({
        services: selection,
        pages,
        adjustments: selectedAdjustments,
      }),
    );
  }, [selection, pages, selectedAdjustments]);

  const chosen = useMemo(
    () => services.filter((service) => selection.includes(service.slug)),
    [services, selection],
  );
  const categories = useMemo(() => {
    const groups = getServiceGroups(services);
    const mappedSlugs = new Set(
      groups
        .filter((group) => !group.id.startsWith("additional-"))
        .flatMap((group) => group.services.map((service) => service.slug)),
    );

    return serviceCategories.map((category) => {
      const categoryGroups = groups.filter((group) =>
        category.groupIds.includes(group.id),
      );
      const categoryServices = new Map();

      categoryGroups.forEach((group) =>
        group.services.forEach((service) =>
          categoryServices.set(service.slug, service),
        ),
      );

      services.forEach((service) => {
        if (mappedSlugs.has(service.slug)) return;
        const fallbackCategory = service.side === "ai" ? "ai" : "web";
        if (fallbackCategory === category.id)
          categoryServices.set(service.slug, service);
      });

      return { ...category, services: [...categoryServices.values()] };
    });
  }, [services]);
  const activeCategoryData = categories.find(
    (category) => category.id === activeCategory,
  );
  const visibleServices = activeCategoryData?.services.slice(
    0,
    showAllServices ? undefined : 6,
  );
  const chosenAdjustments = useMemo(
    () =>
      adjustments.filter((option) => selectedAdjustments.includes(option.id)),
    [adjustments, selectedAdjustments],
  );
  const estimate = useMemo(() => {
    const min = chosen.reduce((sum, service) => sum + service.from, 0);
    const max = chosen.reduce((sum, service) => sum + service.to, 0);
    const pageOption = adjustments.find((option) => option.id === "extra-page");
    const extraPages = Math.max(0, pages - 1);
    const adjustmentMin =
      chosenAdjustments.reduce((sum, option) => sum + option.min_amount, 0) +
      (pageOption ? pageOption.min_amount * extraPages : 0);
    const adjustmentMax =
      chosenAdjustments.reduce((sum, option) => sum + option.max_amount, 0) +
      (pageOption ? pageOption.max_amount * extraPages : 0);
    return {
      min: min + adjustmentMin,
      max: max + adjustmentMax,
      custom: chosen.some((service) => service.customQuote),
      eligible:
        chosen.length > 0 &&
        chosen.some((service) => service.from > 0) &&
        chosen.every((service) => service.studentEligible),
    };
  }, [chosen, chosenAdjustments, adjustments, pages]);
  const studentDiscount =
    studentAuthorized && estimate.eligible
      ? {
          min: Math.round(estimate.min * 0.25),
          max: Math.round(estimate.max * 0.25),
        }
      : null;
  const studentEstimate = studentDiscount
    ? {
        min: estimate.min - studentDiscount.min,
        max: estimate.max - studentDiscount.max,
      }
    : null;
  const expectedDays =
    Math.max(7, ...chosen.map((service) => service.days || 7)) +
    chosenAdjustments.length * 2 +
    Math.max(0, pages - 1);
  const expectedWeeks = chosen.length
    ? `${Math.max(1, Math.ceil(expectedDays / 7))}–${Math.max(2, Math.ceil((expectedDays + 7) / 7))} weeks`
    : "—";

  function toggleService(slug) {
    setSelection((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug],
    );
  }
  function toggleAdjustment(id) {
    setSelectedAdjustments((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }
  async function submit(event) {
    event.preventDefault();
    if (!chosen.length) {
      setError("Choose at least one service to continue.");
      return;
    }
    setBusy(true);
    setError("");
    const form = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          services: chosen.map((service) => service.slug),
          timeline,
          requirements: { pages, adjustments: selectedAdjustments },
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || "Your request could not be sent. Please try again.",
        );
      localStorage.removeItem("sparse-project-draft");
      router.push("/track/" + result.code + "?new=1");
    } catch (problem) {
      setError(problem.message || "A network error prevented submission.");
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-page px-7 pb-[90px] pt-[116px] max-[760px]:px-[22px] max-[680px]:pb-[62px] max-[680px]:pt-[103px]">
      <div className="mb-[68px] max-[680px]:mb-[52px]">
        <PageHero
          eyebrow="Requirement-based estimator"
          title="Shape your next"
          highlight="big idea."
          description="Choose the work and requirements you have in mind. You’ll get an indicative range—not a binding quote."
          kind="project"
          meta={
            studentAuthorized
              ? "25% Student Offer applied to eligible work"
              : "25% Student Offer available after student verification"
          }
        />
      </div>
      <form
        className="grid min-w-0 grid-cols-[minmax(0,1fr)_310px] items-start gap-[22px] max-[900px]:grid-cols-[minmax(0,1fr)_270px] max-[900px]:gap-[15px] max-[680px]:grid-cols-1"
        onSubmit={submit}
      >
        <div className="grid min-w-0 gap-6">
          <section className={stepClasses}>
            <div className={stepTitleClasses}>
              <span className={stepNumberClasses}>01</span>
              <div className="min-w-0">
                <h2 className="mb-1 mt-0.5 text-[1.13rem]">
                  What are we working on?
                </h2>
                <p className="m-0 text-[0.79rem] leading-[1.55] text-[#9298b0]">
                  Choose one or more services. Combine disciplines in one
                  project request.
                </p>
              </div>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={activeCategory === category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setShowAllServices(false);
                  }}
                  className={`rounded-full border px-3 py-2 text-left text-[0.72rem] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4c97f4] ${
                    activeCategory === category.id
                      ? "border-[#e9c66d]/45 bg-[#e9c66d]/[0.09] text-[#f0d37c]"
                      : "border-[#292e45] bg-[#080a10] text-[#aeb4c3] hover:border-[#4c97f4]/50 hover:text-white"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
            <p className="mb-3 mt-0 text-[0.75rem] text-[#9298b0]">
              {activeCategoryData?.services.length || 0} options · Select any
              services you need; you can combine areas.
            </p>
            <div className="grid gap-2.5">
              {visibleServices?.map((service) => {
                const selected = selection.includes(service.slug);
                return (
                  <div
                    className={`rounded-[10px] border transition-colors duration-[180ms] ${
                      selected
                        ? "border-[#4c97f4]/60 bg-[#1e304f]/25"
                        : "border-[#242941] bg-[#06080b]"
                    }`}
                    key={service.slug}
                  >
                    <label className="flex cursor-pointer items-center gap-3.5 p-[18px_17px] max-[480px]:flex-wrap">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleService(service.slug)}
                        className="m-0 h-4 w-4 shrink-0 appearance-auto rounded accent-[#4c97f4]"
                      />
                      <ServiceMark service={service} compact />
                      <span className="grid min-w-0 flex-1 gap-0.5">
                        <strong className="text-[0.82rem]">
                          {service.title}
                        </strong>
                        <small className="text-[0.7rem] leading-[1.45] text-[#969bb2]">
                          {service.short}
                        </small>
                      </span>
                      <span className="whitespace-nowrap text-[0.72rem] text-[#bdc2d5] max-[480px]:ml-[43px] max-[480px]:whitespace-normal">
                        {service.customQuote
                          ? "Custom quote" +
                            (service.from
                              ? ` · est. ₹${service.from.toLocaleString("en-IN")}–₹${service.to.toLocaleString("en-IN")}${service.openEnded ? "+" : ""}`
                              : "")
                          : `₹${service.from.toLocaleString("en-IN")}–₹${service.to.toLocaleString("en-IN")}${service.openEnded ? "+" : ""}`}
                      </span>
                    </label>
                    {service.studentEligible && (
                      <small className="mb-4 ml-[75px] mt-0 block text-[0.7rem] leading-[1.45] text-[#d9be6d]">
                        25% Student Offer after verification
                      </small>
                    )}
                  </div>
                );
              })}
            </div>
            {!!activeCategoryData && activeCategoryData.services.length > 6 && (
              <button
                type="button"
                onClick={() => setShowAllServices((current) => !current)}
                className="mt-4 rounded-full border border-[#292e45] px-3.5 py-2 text-[0.73rem] font-semibold text-[#d5d7e4] transition-colors hover:border-[#4c97f4]/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4c97f4]"
              >
                {showAllServices
                  ? "Show fewer services"
                  : `Show all ${activeCategoryData.services.length} services`}
              </button>
            )}
          </section>

          <section className={stepClasses}>
            <div className={stepTitleClasses}>
              <span className={stepNumberClasses}>02</span>
              <div className="min-w-0">
                <h2 className="mb-1 mt-0.5 text-[1.13rem]">
                  Shape the requirements.
                </h2>
                <p className="m-0 text-[0.79rem] leading-[1.55] text-[#9298b0]">
                  Choose relevant features to improve the indicative range.
                  Leave anything undecided for a conversation.
                </p>
              </div>
            </div>
            <label className={fieldLabelClasses}>
              Approximate number of pages
              <input
                type="number"
                name="pages"
                min="1"
                max="100"
                value={pages}
                onChange={(event) =>
                  setPages(
                    Math.max(1, Math.min(100, Number(event.target.value) || 1)),
                  )
                }
                className={fieldClasses}
              />
            </label>
            <div className="my-[18px] mb-[26px] grid grid-cols-2 gap-2.5 max-[680px]:grid-cols-1">
              {adjustments
                .filter((option) => option.id !== "extra-page")
                .map((option) => (
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-[14px] border p-[15px] ${
                      selectedAdjustments.includes(option.id)
                        ? "border-[#4c97f4]/65 bg-[#4c97f4]/10"
                        : "border-[#1b1e29] bg-[rgba(13,16,32,0.65)]"
                    }`}
                    key={option.id}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAdjustments.includes(option.id)}
                      onChange={() => toggleAdjustment(option.id)}
                      className="h-4 w-4 shrink-0 accent-[#4c97f4]"
                    />
                    <span className="grid flex-1 gap-[3px]">
                      <strong className="text-[0.88rem]">{option.label}</strong>
                      <small className="text-[0.74rem] text-[#a0a4b6]">
                        {option.description}
                      </small>
                    </span>
                    <small className="text-[0.74rem] text-[#a0a4b6]">
                      {format(option.min_amount)}–{format(option.max_amount)}
                    </small>
                  </label>
                ))}
            </div>
            <div className="grid gap-[15px]">
              <label className={fieldLabelClasses}>
                Project name{" "}
                <span className="text-[0.67rem] font-normal text-[#79819c]">
                  Optional
                </span>
                <input
                  name="projectName"
                  maxLength="120"
                  placeholder="e.g. Research assistant prototype"
                  className={fieldClasses}
                />
              </label>
              <label className={fieldLabelClasses}>
                Project brief
                <textarea
                  name="details"
                  rows="5"
                  minLength="10"
                  maxLength="5000"
                  required
                  placeholder="What are you trying to make, study or improve? What would a useful outcome look like?"
                  className={`${fieldClasses} min-h-[115px] resize-y`}
                />
              </label>
              <div className="grid grid-cols-2 gap-[13px] max-[680px]:grid-cols-1">
                <label className={fieldLabelClasses}>
                  Budget range
                  <select
                    name="budgetRange"
                    defaultValue="not-sure"
                    className={fieldClasses}
                  >
                    <option value="not-sure">Not sure yet</option>
                    <option value="under-25000">Under ₹25,000</option>
                    <option value="25000-50000">₹25,000 – ₹50,000</option>
                    <option value="50000-100000">₹50,000 – ₹1,00,000</option>
                    <option value="100000-plus">₹1,00,000+</option>
                  </select>
                </label>
                <label className={fieldLabelClasses}>
                  Reference link{" "}
                  <span className="text-[0.67rem] font-normal text-[#79819c]">
                    Optional
                  </span>
                  <input
                    name="referenceUrl"
                    type="url"
                    maxLength="2048"
                    placeholder="https://"
                    className={fieldClasses}
                  />
                </label>
              </div>
            </div>
          </section>

          <section className={stepClasses}>
            <div className={stepTitleClasses}>
              <span className={stepNumberClasses}>03</span>
              <div className="min-w-0">
                <h2 className="mb-1 mt-0.5 text-[1.13rem]">
                  When are you hoping to begin?
                </h2>
                <p className="m-0 text-[0.79rem] leading-[1.55] text-[#9298b0]">
                  Timing helps us assess feasibility. It does not add an
                  automatic rush fee.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5 max-[680px]:grid-cols-1">
              <label
                className={`flex cursor-pointer items-start gap-2.5 rounded-[10px] border p-[13px] ${
                  timeline === "flexible"
                    ? "border-[#4c97f4]/60 bg-[#264c7b]/20"
                    : "border-[#252a41] bg-[#06080b]"
                }`}
              >
                <input
                  type="radio"
                  name="timeline"
                  value="flexible"
                  checked={timeline === "flexible"}
                  onChange={() => setTimeline("flexible")}
                  className="mt-[3px] h-[15px] w-[15px] shrink-0 accent-[#4c97f4]"
                />
                <span className="block">
                  <strong className="block text-[0.78rem]">Flexible</strong>
                  <small className="mt-[3px] block text-[0.68rem] leading-[1.45] text-[#9298b0]">
                    Let’s agree a realistic plan together
                  </small>
                </span>
              </label>
              <label
                className={`flex cursor-pointer items-start gap-2.5 rounded-[10px] border p-[13px] ${
                  timeline === "target"
                    ? "border-[#4c97f4]/60 bg-[#264c7b]/20"
                    : "border-[#252a41] bg-[#06080b]"
                }`}
              >
                <input
                  type="radio"
                  name="timeline"
                  value="target"
                  checked={timeline === "target"}
                  onChange={() => setTimeline("target")}
                  className="mt-[3px] h-[15px] w-[15px] shrink-0 accent-[#4c97f4]"
                />
                <span className="block">
                  <strong className="block text-[0.78rem]">
                    I have a target date
                  </strong>
                  <small className="mt-[3px] block text-[0.68rem] leading-[1.45] text-[#9298b0]">
                    We’ll review it before confirming
                  </small>
                </span>
              </label>
            </div>
            {timeline === "target" && (
              <label className={`${fieldLabelClasses} mt-4`}>
                Target date (optional)
                <input name="targetDate" type="date" className={fieldClasses} />
              </label>
            )}
          </section>

          <section className={stepClasses}>
            <div className={stepTitleClasses}>
              <span className={stepNumberClasses}>04</span>
              <div className="min-w-0">
                <h2 className="mb-1 mt-0.5 text-[1.13rem]">
                  Where should we reach you?
                </h2>
                <p className="m-0 text-[0.79rem] leading-[1.55] text-[#9298b0]">
                  Your request stays private. We’ll email you a secure project
                  tracking link.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-[13px] max-[680px]:grid-cols-1">
              <label className={fieldLabelClasses}>
                Your name
                <input
                  name="name"
                  autoComplete="name"
                  maxLength="80"
                  required
                  className={fieldClasses}
                />
              </label>
              <label className={fieldLabelClasses}>
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength="120"
                  required
                  className={fieldClasses}
                />
              </label>
            </div>
            {error && (
              <p className="m-0 text-sm text-[#ff8585]" role="alert">
                {error}
              </p>
            )}
            <button
              className="mt-2 inline-flex cursor-pointer items-center justify-center gap-[9px] rounded-full border border-[#e9c66d]/40 bg-gradient-to-r from-[#397ed0] to-[#2868b8] px-5 py-[11px] text-[0.93rem] font-semibold text-white shadow-[0_8px_25px_rgba(39,105,190,0.24)] transition duration-200 hover:-translate-y-0.5 hover:border-[#e9c66d] hover:from-[#4c97f4] hover:to-[#3478cf] hover:shadow-[0_10px_30px_rgba(39,105,190,0.36)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4c97f4] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={busy || !chosen.length}
            >
              {busy ? "Sending your request…" : "Request a detailed quote"}{" "}
              <span aria-hidden="true">↗</span>
            </button>
            <p className="-mt-[7px] mb-0 text-[0.69rem] text-[#7f879f]">
              No payment is taken here. We’ll review your requirements and send
              a confirmed quote before work begins.
            </p>
          </section>
        </div>

        <aside className="sticky top-24 rounded-[13px] border border-[#282e49] bg-[radial-gradient(ellipse_at_100%_0,rgba(76,151,244,0.075),transparent_48%),#080a0e] p-[19px] max-[900px]:p-4 max-[680px]:static max-[680px]:order-first">
          <div className="flex items-center gap-2.5 border-b border-[#252a40] pb-[14px]">
            <span
              className="grid h-[34px] w-[34px] place-items-center rounded-[9px] border border-[#e9c66d]/25 bg-[#e9c66d]/10 text-[#e9c66d]"
              aria-hidden="true"
            >
              ✳
            </span>
            <div>
              <strong className="block text-[0.87rem]">Your estimate</strong>
              <small className="block text-[0.68rem] text-[#8e95ad]">
                Based on the requirements selected
              </small>
            </div>
          </div>
          {chosen.length ? (
            <ul className="my-[17px] grid list-none gap-3 p-0">
              {chosen.map((service) => (
                <li className="grid gap-0.5" key={service.slug}>
                  <span className="text-[0.75rem]">{service.title}</span>
                  <small className="text-[0.68rem] text-[#8d94ac]">
                    {service.customQuote
                      ? "Custom quote required" +
                        (service.from
                          ? ` · indicative ₹${service.from.toLocaleString("en-IN")}–₹${service.to.toLocaleString("en-IN")}${service.openEnded ? "+" : ""}`
                          : "")
                      : `₹${service.from.toLocaleString("en-IN")}–₹${service.to.toLocaleString("en-IN")}${service.openEnded ? "+" : ""}`}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <p className="my-4 text-[0.76rem] text-[#878ea7]">
              Choose services to shape the estimate.
            </p>
          )}
          <div className="flex items-center justify-between border-t border-[#252a40] pt-[14px] text-[0.73rem] text-[#c3c7d7]">
            <span className="pr-2">Estimated project cost</span>
            <strong className="text-right font-display text-[1.13rem] font-bold text-[#f2f3f8]">
              {chosen.length
                ? estimate.custom && estimate.max === 0
                  ? "Custom quote"
                  : estimate.custom &&
                      chosen.some((service) => service.from === 0)
                    ? `Custom quote + indicative ${format(estimate.min)} – ${format(estimate.max)}`
                    : `${format(estimate.min)} – ${format(estimate.max)}${chosen.some((service) => service.openEnded) ? "+" : ""}`
                : "—"}
            </strong>
          </div>
          {studentDiscount && (
            <>
              <div className="flex items-center justify-between border-t border-[#252a40] pt-[14px] text-[0.73rem] text-[#c3c7d7]">
                <span className="pr-2">Student Discount (25%)</span>
                <strong className="text-right text-[0.95rem] font-bold text-[#e9c66d]">
                  −{format(studentDiscount.min)} to −
                  {format(studentDiscount.max)}
                </strong>
              </div>
              <div className="flex items-center justify-between border-t border-[#252a40] pt-[14px] text-[0.73rem] text-[#c3c7d7]">
                <span className="pr-2">Estimated Student Price</span>
                <strong className="text-right font-display text-[1.13rem] font-bold text-[#f2f3f8]">
                  {format(studentEstimate.min)} – {format(studentEstimate.max)}
                  {chosen.some((service) => service.openEnded) ? "+" : ""}
                </strong>
              </div>
            </>
          )}
          <div className="flex items-center justify-between border-t border-[#252a40] pt-[14px] text-[0.73rem] text-[#c3c7d7]">
            <span className="pr-2">Estimated timeline</span>
            <strong className="text-right font-display text-[1.13rem] font-bold text-[#f2f3f8]">
              {expectedWeeks}
            </strong>
          </div>
          {estimate.custom && (
            <p className="my-[10px] mb-[15px] text-[0.69rem] leading-[1.55] text-[#8a91a9]">
              One or more selected services need a custom quote. Displayed
              ranges are indicative and may not cover all requirements.
            </p>
          )}
          <p className="my-[10px] mb-[15px] text-[0.69rem] leading-[1.55] text-[#8a91a9]">
            This is an indicative estimate, not a binding quote. Final scope and
            price depend on requirements and complexity.
          </p>
          <div className="flex items-start gap-2 rounded-[9px] border border-[#4c97f4]/20 bg-[#4c97f4]/[0.06] p-2.5">
            <span className="font-bold text-[#89b6f6]" aria-hidden="true">
              ✓
            </span>
            <p className="m-0 text-[0.67rem] leading-[1.5] text-[#a5abc0]">
              No unnecessary subscriptions or hidden development charges.
              External services are separate and discussed before work begins.
            </p>
          </div>
          <Link
            href="/services"
            className="mt-[14px] flex justify-between text-[0.71rem] font-bold text-[#e9c66d] no-underline transition-colors hover:text-[#80b3ff]"
          >
            Compare all services <span aria-hidden="true">↗</span>
          </Link>
        </aside>
      </form>
      <p className="my-[26px] rounded-2xl border border-[#e9c66d]/20 bg-[linear-gradient(110deg,rgba(233,198,109,0.045),rgba(76,151,244,0.035)),#07080c] px-5 py-[17px] text-[0.88rem] text-[#bdc2d5] max-[680px]:text-[0.82rem]">
        Domain, hosting, database hosting, email services, API usage, AI model
        usage, cloud storage, payment gateway fees and third-party software are
        not secretly included. Any required external costs are explained before
        the project begins.
      </p>
    </main>
  );
}
