"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { getServiceGroups } from "../lib/service-groups";
import ServiceMark from "./ServiceMark";

const formatRange = (service) =>
  `₹${service.from.toLocaleString("en-IN")}–₹${service.to.toLocaleString("en-IN")}${service.openEnded ? "+" : ""}`;

export default function ServiceBrowser({ services, initialCategory = "" }) {
  const [query, setQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(initialCategory);
  const [sort, setSort] = useState("az");
  const [savedOnly, setSavedOnly] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [compared, setCompared] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const reducedMotion = useReducedMotion();
  const groups = useMemo(() => getServiceGroups(services), [services]);
  const activeGroup = groups.find((group) => group.id === selectedGroup);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("sparse-saved-services") || "[]",
      );
      if (Array.isArray(saved))
        setFavorites(
          saved.filter((slug) =>
            services.some((service) => service.slug === slug),
          ),
        );
    } catch {
      localStorage.removeItem("sparse-saved-services");
    }
    setLoaded(true);
  }, [services]);
  useEffect(() => {
    if (loaded)
      localStorage.setItem("sparse-saved-services", JSON.stringify(favorites));
  }, [favorites, loaded]);

  const list = useMemo(() => {
    const matching = services.filter(
      (service) =>
        (!selectedGroup || activeGroup?.slugs.includes(service.slug)) &&
        (!savedOnly || favorites.includes(service.slug)) &&
        (service.title + " " + service.short + " " + service.points.join(" "))
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    );
    return matching.sort((a, b) =>
      sort === "low"
        ? a.from - b.from
        : sort === "fast"
          ? a.days - b.days
          : a.title.localeCompare(b.title),
    );
  }, [services, selectedGroup, activeGroup, savedOnly, favorites, query, sort]);

  function toggleFavorite(slug) {
    setFavorites((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug],
    );
  }
  function toggleCompared(slug) {
    setCompared((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : current.length < 3
          ? [...current, slug]
          : current,
    );
  }
  function selectGroup(groupId) {
    setSelectedGroup(groupId);
    setSavedOnly(false);
  }
  const comparisonServices = services.filter((service) =>
    compared.includes(service.slug),
  );
  const showResults = Boolean(query.trim() || selectedGroup || savedOnly);

  return (
    <>
      <p className="my-[26px] rounded-2xl border border-[rgba(233,198,109,0.2)] bg-[linear-gradient(110deg,rgba(233,198,109,0.07),rgba(76,151,244,0.045))] px-5 py-[17px] text-[0.88rem] text-[#bdc2d5] max-[680px]:text-[0.82rem]">
        Every project is built around your requirements. Prices shown are
        estimates, not fixed packages. Final pricing depends on scope, features,
        design, integrations and complexity.
      </p>
      <div className="my-[18px] flex items-center gap-[18px] rounded-[14px] border border-[rgba(151,163,202,0.1)] bg-[rgba(6,7,10,0.82)] p-[13px] max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:gap-[10px]">
        <label className="flex min-w-[180px] flex-1 items-center gap-[11px] rounded-[10px] border border-[#1d2029] bg-[#040507] px-3 text-[#8f9ab0] transition-[border-color,box-shadow] focus-within:border-[rgba(76,151,244,0.55)] focus-within:shadow-[0_0_0_3px_rgba(76,151,244,0.08)]">
          <span aria-hidden="true" className="text-xl">
            ⌕
          </span>
          <input
            aria-label="Search all services"
            placeholder="Search all services, skills and deliverables"
            className="min-h-[42px] w-full min-w-0 border-0 bg-transparent py-2 outline-none focus:outline-none focus:ring-0"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              if (event.target.value.trim()) setSelectedGroup("");
            }}
          />
          {query && (
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent text-[0.72rem] font-semibold text-[#a9b0c1] hover:text-lab-blue"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </label>
        <div className="flex items-center gap-3 max-[760px]:justify-between">
          <button
            className={`flex items-center gap-2 rounded-[9px] border px-3 py-[9px] text-[0.77rem] font-semibold transition-colors ${savedOnly ? "border-[rgba(233,198,109,0.4)] bg-[rgba(233,198,109,0.06)] text-white" : "border-[#222631] bg-[#08090d] text-[#c1c6d3] hover:border-[rgba(233,198,109,0.4)] hover:bg-[rgba(233,198,109,0.06)] hover:text-white"} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-lab-blue`}
            onClick={() => {
              setSavedOnly((value) => !value);
              setSelectedGroup("");
            }}
            aria-pressed={savedOnly}
          >
            Saved <span className="text-lab-gold">{favorites.length}</span>
          </button>
          {showResults && (
            <label className="flex items-center gap-2 text-[0.72rem] text-[#8f96a8]">
              Sort
              <select
                aria-label="Sort services"
                className="min-h-10 rounded-md border border-[#20232d] bg-[#050609] px-[10px] py-[7px] text-lab-text"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="az">A to Z</option>
                <option value="low">Lowest estimate</option>
                <option value="fast">Fastest delivery</option>
              </select>
            </label>
          )}
        </div>
      </div>
      <p
        className="my-1 flex justify-between gap-4 text-[0.8rem] text-[#b9bfd3] max-[760px]:grid max-[760px]:gap-[3px]"
        aria-live="polite"
      >
        {showResults
          ? `${list.length} ${list.length === 1 ? "service" : "services"}${activeGroup ? ` · ${activeGroup.title}` : ""}`
          : `${services.length} specialist offerings across ${groups.length} disciplines`}
        <span className="text-right text-[#858ba2] max-[760px]:text-left">
          {compared.length === 3
            ? "Maximum 3 selected · remove one to compare another"
            : "Search everything or choose a discipline to explore its offerings."}
        </span>
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {!showResults ? (
          <motion.section
            key="disciplines"
            className="grid grid-cols-1 gap-[14px] min-[481px]:max-[950px]:grid-cols-2 min-[951px]:grid-cols-4"
            aria-label="Service disciplines"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.28 }}
          >
            {groups.map((group, index) => (
              <motion.button
                type="button"
                layout={!reducedMotion}
                whileHover={reducedMotion ? undefined : { y: -5 }}
                whileTap={reducedMotion ? undefined : { scale: 0.985 }}
                key={group.id}
                className="relative flex min-h-[300px] min-w-0 cursor-pointer flex-col items-center overflow-hidden rounded-[15px] border border-[#191b22] bg-[radial-gradient(ellipse_at_50%_6%,rgba(76,151,244,0.075),transparent_43%),linear-gradient(150deg,#0a0b10,#06070a)] px-[21px] pb-[21px] pt-[25px] text-center text-lab-text transition-[border-color,box-shadow,background] duration-300 hover:border-[rgba(76,151,244,0.45)] hover:bg-[radial-gradient(ellipse_at_50%_23%,rgba(76,151,244,0.09),transparent_53%),linear-gradient(150deg,#0b0d12,#06070a)] hover:shadow-[0_18px_48px_rgba(0,0,0,0.38),0_0_32px_rgba(76,151,244,0.055)] focus-visible:border-[rgba(233,198,109,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[rgba(233,198,109,0.55)] focus-visible:shadow-[0_0_0_4px_rgba(233,198,109,0.1),0_18px_46px_rgba(0,0,0,0.4)] before:pointer-events-none before:absolute before:left-[18%] before:top-0 before:h-px before:w-[64%] before:bg-[linear-gradient(90deg,transparent,rgba(76,151,244,0.42),rgba(233,198,109,0.48),transparent)] before:opacity-[0.32] before:transition-[opacity,transform] before:duration-300 hover:before:scale-x-[1.18] hover:before:opacity-[0.9] after:absolute after:left-1/2 after:top-[100px] after:h-[65px] after:w-px after:-translate-x-1/2 after:bg-[linear-gradient(rgba(76,151,244,0.18),transparent)] after:opacity-[0.55] max-[480px]:min-h-[270px]"
                onClick={() => selectGroup(group.id)}
                initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.3,
                  delay: reducedMotion ? 0 : index * 0.035,
                }}
              >
                <span className="absolute left-[19px] top-[17px] font-sans text-[0.62rem] font-semibold tracking-[0.1em] text-[#667084]">
                  {group.number}
                </span>
                <ServiceMark service={group.representative} />
                <span className="mt-1 font-sans text-[0.58rem] font-semibold tracking-[0.13em] text-[#858da0]">
                  {String(group.count).padStart(2, "0")} OFFERINGS
                </span>
                <strong className="my-[9px] mb-[6px] font-display text-base font-bold leading-tight">
                  {group.title}
                </strong>
                <span className="max-w-[280px] text-[0.77rem] leading-[1.55] text-[#9ca2b0]">
                  {group.description}
                </span>
                <span className="mt-auto flex items-center gap-2 pt-4 text-xs font-bold text-lab-gold">
                  Explore services <span aria-hidden="true">↗</span>
                </span>
              </motion.button>
            ))}
          </motion.section>
        ) : (
          <motion.section
            key={selectedGroup || `search-${query}-${savedOnly}`}
            className="min-h-[260px] rounded-2xl border border-[#1b1e27] bg-[radial-gradient(ellipse_at_85%_0,rgba(76,151,244,0.045),transparent_45%),linear-gradient(145deg,#090a0f,#050609)] p-[25px_27px] shadow-[0_24px_80px_rgba(0,0,0,0.18)] max-[480px]:px-[14px] max-[480px]:py-[19px]"
            aria-label={
              activeGroup
                ? `${activeGroup.title} services`
                : "Matching services"
            }
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.24 }}
          >
            <div className="flex items-end justify-between gap-[18px] border-b border-[rgba(151,163,202,0.11)] pb-[17px] max-[760px]:items-start max-[480px]:gap-2">
              <div>
                {activeGroup && (
                  <button
                    className="cursor-pointer border-0 bg-transparent p-0 text-[0.76rem] font-semibold text-lab-blue hover:text-lab-gold"
                    onClick={() => setSelectedGroup("")}
                  >
                    ← All disciplines
                  </button>
                )}
                <p className="mb-[7px] mt-[11px] flex items-center gap-[9px] text-[0.68rem] font-bold uppercase tracking-[0.15em] text-[#e4c36c]">
                  {activeGroup?.number || "CATALOGUE"} /{" "}
                  {activeGroup ? "DISCIPLINE" : "SEARCH RESULTS"}
                </p>
                <h2 className="m-0 text-[clamp(1.55rem,3vw,2.05rem)]">
                  {activeGroup?.title ||
                    (savedOnly && !query
                      ? "Saved services"
                      : query
                        ? "Matching services"
                        : "All services")}
                </h2>
                <p className="mt-2 max-w-[600px] text-[0.81rem] text-[#9ca2b0]">
                  {activeGroup?.description ||
                    (query
                      ? "Every offering is searchable by name, capability and scope."
                      : "Your saved shortlist, ready to shape into a project.")}
                </p>
              </div>
              <span className="mt-[13px] flex-none rounded-full border border-[rgba(151,163,202,0.14)] px-[9px] py-[6px] font-sans text-[0.59rem] font-semibold tracking-[0.1em] text-[#a0a7b7] max-[760px]:mt-0">
                {String(list.length).padStart(2, "0")}{" "}
                {list.length === 1 ? "SERVICE" : "SERVICES"}
              </span>
            </div>
            <div className="grid grid-cols-1">
              {list.map((service, index) => (
                <motion.article
                  layout={!reducedMotion}
                  key={service.slug}
                  className="rounded-[9px] border-b border-[rgba(151,163,202,0.1)] transition-colors last:border-b-0 hover:bg-[rgba(76,151,244,0.025)] motion-reduce:transition-none"
                  initial={reducedMotion ? false : { opacity: 0, y: 9 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.2,
                    delay: reducedMotion ? 0 : Math.min(index * 0.018, 0.16),
                  }}
                >
                  <Link
                    href={"/services/" + service.slug}
                    className="group grid grid-cols-[55px_minmax(0,1fr)_minmax(140px,auto)_20px] items-center gap-[13px] px-[10px] pb-[11px] pt-[17px] text-inherit no-underline max-[760px]:grid-cols-[43px_minmax(0,1fr)_auto_15px] max-[760px]:gap-[10px] max-[760px]:px-1 max-[760px]:pb-[9px] max-[760px]:pt-[15px] max-[480px]:grid-cols-[38px_minmax(0,1fr)_16px]"
                  >
                    <ServiceMark service={service} compact />
                    <span className="grid min-w-0 gap-1">
                      <strong className="font-display text-[0.91rem] font-bold leading-[1.3]">
                        {service.title}
                      </strong>
                      <small className="max-w-[650px] text-[0.74rem] leading-[1.5] text-[#969cac]">
                        {service.short}
                      </small>
                    </span>
                    <span className="text-right text-[0.77rem] font-bold text-lab-gold max-[760px]:text-[0.7rem] max-[480px]:col-[2] max-[480px]:row-[2] max-[480px]:text-left">
                      {service.customQuote
                        ? "Custom quote"
                        : `₹${formatRange(service)}`}
                      <small className="mt-[3px] block text-[0.65rem] font-normal text-[#838a9c]">
                        About {service.days} days
                      </small>
                    </span>
                    <span
                      className="text-[#7c8ba8] transition-[transform,color] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-lab-gold max-[480px]:col-[3] max-[480px]:row-[1] motion-reduce:transition-none"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </Link>
                  <div className="flex items-center justify-end gap-[15px] px-11 pb-3 pl-[78px] max-[760px]:gap-3 max-[760px]:px-[27px] max-[760px]:pb-[11px] max-[760px]:pl-14 max-[480px]:flex-wrap max-[480px]:justify-start max-[480px]:pl-[51px]">
                    {service.studentEligible && (
                      <span className="mr-auto rounded-full border border-[rgba(233,198,109,0.32)] bg-[rgba(233,198,109,0.08)] px-2 py-1 text-[0.66rem] font-bold text-lab-gold max-[480px]:mr-0 max-[480px]:w-full">
                        25% Student Offer
                      </span>
                    )}
                    <Link
                      className="py-[5px] text-[0.71rem] font-bold text-lab-gold no-underline hover:text-lab-blue"
                      href={"/project-builder?service=" + service.slug}
                    >
                      Configure <span aria-hidden="true">↗</span>
                    </Link>
                    <button
                      className={`cursor-pointer border-0 bg-transparent px-0 py-[5px] text-[0.69rem] font-semibold transition-colors ${compared.includes(service.slug) ? "text-lab-blue" : "text-[#9ba0b6] hover:text-lab-gold"} disabled:cursor-not-allowed disabled:text-[#5e6479]`}
                      aria-label={
                        (compared.includes(service.slug) ? "Remove " : "Add ") +
                        service.title +
                        " " +
                        (compared.includes(service.slug) ? "from" : "to") +
                        " comparison"
                      }
                      aria-pressed={compared.includes(service.slug)}
                      disabled={
                        !compared.includes(service.slug) && compared.length >= 3
                      }
                      onClick={() => toggleCompared(service.slug)}
                    >
                      {compared.includes(service.slug)
                        ? "Comparing"
                        : "Compare"}
                    </button>
                    <button
                      className={`cursor-pointer border-0 bg-transparent px-0 py-[5px] text-[0.69rem] font-semibold transition-colors ${favorites.includes(service.slug) ? "text-lab-gold" : "text-[#9ba0b6] hover:text-lab-gold"}`}
                      aria-label={
                        favorites.includes(service.slug)
                          ? "Remove " + service.title + " from saved services"
                          : "Save " + service.title
                      }
                      aria-pressed={favorites.includes(service.slug)}
                      onClick={() => toggleFavorite(service.slug)}
                    >
                      {favorites.includes(service.slug) ? "Saved ★" : "Save ☆"}
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
            {!list.length && (
              <div className="flex min-h-[240px] flex-col items-center justify-center p-[30px] text-center">
                <ServiceMark
                  service={
                    activeGroup?.representative || {
                      slug: "research-ml",
                      title: "Research and ML",
                      side: "ai",
                    }
                  }
                />
                <strong className="font-display text-base font-bold">
                  {savedOnly && !favorites.length
                    ? "Your shortlist starts here"
                    : "No matching services"}
                </strong>
                <p className="mb-[17px] mt-[7px] max-w-[360px] text-[0.81rem] text-[#989eae]">
                  {savedOnly && !favorites.length
                    ? "Save an offering to keep it close while you explore."
                    : "Try a different phrase or explore all disciplines."}
                </p>
                <button
                  className="rounded-lg border border-[#272d3a] bg-[#080a0f] px-4 py-2 text-sm font-semibold text-lab-text transition hover:border-[rgba(76,151,244,0.5)] hover:bg-[#10141c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-lab-blue"
                  onClick={() => {
                    setQuery("");
                    setSavedOnly(false);
                    setSelectedGroup("");
                  }}
                >
                  Explore all disciplines
                </button>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {comparisonServices.length > 0 && (
        <section
          className="mt-11 rounded-[15px] border border-[rgba(76,151,244,0.24)] bg-[linear-gradient(135deg,rgba(9,11,16,0.97),rgba(5,6,9,0.97))] p-[25px] shadow-[0_24px_80px_rgba(0,0,0,0.18)] max-[760px]:px-[15px] max-[760px]:py-[19px]"
          aria-labelledby="service-compare-title"
        >
          <div className="mb-[18px] flex items-center justify-between gap-4 max-[480px]:items-start">
            <div>
              <p className="mb-[7px] flex items-center gap-[9px] text-[0.68rem] font-bold uppercase tracking-[0.15em] text-[#e4c36c]">
                Side-by-side
              </p>
              <h2 className="m-0 text-[1.45rem]" id="service-compare-title">
                Compare services{" "}
                <span className="text-[0.82rem] text-[#8991aa]">
                  ({comparisonServices.length}/3)
                </span>
              </h2>
            </div>
            <button
              className="cursor-pointer border-0 bg-transparent py-1 text-[0.74rem] font-semibold text-lab-gold transition-colors hover:-translate-y-px hover:text-lab-blue"
              onClick={() => setCompared([])}
            >
              Clear comparison
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left [&_td]:border-b [&_td]:border-[rgba(151,163,202,0.12)] [&_td]:p-[13px_15px] [&_td]:align-top [&_td]:text-[0.77rem] [&_td]:leading-[1.55] [&_td]:text-[#aeb4c8] [&_th]:border-b [&_th]:border-[rgba(151,163,202,0.12)] [&_th]:p-[13px_15px] [&_th]:align-top [&_th]:text-[0.78rem] [&_th]:text-[#aeb5ca] [&_thead_th:first-child]:w-[140px] [&_thead_th:first-child]:text-[0.72rem] [&_thead_th:first-child]:text-[#8189a4] [&_tbody_th]:w-[140px] [&_tbody_th]:text-[0.72rem] [&_tbody_th]:text-[#8189a4] [&_thead_a]:text-[#edf0fa] [&_thead_a]:no-underline [&_thead_a:hover]:text-lab-gold [&_td_strong]:mt-1 [&_td_strong]:block [&_td_strong]:text-[0.84rem] [&_td_strong]:text-lab-gold">
              <thead>
                <tr>
                  <th className="text-[#8189a4]" scope="col">
                    Details
                  </th>
                  {comparisonServices.map((service) => (
                    <th scope="col" key={service.slug}>
                      <Link href={"/services/" + service.slug}>
                        {service.title}
                      </Link>
                      <button
                        className="mt-[5px] block cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.65rem] font-medium text-[#7e88a3] hover:text-[#f09595]"
                        onClick={() => toggleCompared(service.slug)}
                        aria-label={
                          "Remove " + service.title + " from comparison"
                        }
                      >
                        Remove
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Estimate</th>
                  {comparisonServices.map((service) => (
                    <td key={service.slug}>
                      {service.customQuote
                        ? "Custom quote · indicative"
                        : "Estimated"}
                      <strong className="mt-1 block text-[0.84rem] text-lab-gold">
                        {service.from
                          ? formatRange(service)
                          : "Discuss your requirements"}
                      </strong>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Indicative delivery</th>
                  {comparisonServices.map((service) => (
                    <td key={service.slug}>About {service.days} days</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Approach</th>
                  {comparisonServices.map((service) => (
                    <td key={service.slug}>
                      {service.points.slice(0, 3).join(" · ")}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Student offer</th>
                  {comparisonServices.map((service) => (
                    <td key={service.slug}>
                      {service.studentEligible
                        ? "25% off after verification"
                        : "Not currently eligible"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Next step</th>
                  {comparisonServices.map((service) => (
                    <td key={service.slug}>
                      <Link
                        className="text-[0.74rem] font-bold text-lab-gold no-underline transition-colors hover:-translate-y-px hover:text-lab-blue"
                        href={"/project-builder?service=" + service.slug}
                      >
                        Configure project ↗
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
