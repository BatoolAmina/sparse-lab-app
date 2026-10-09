import Link from "next/link";
import { notFound } from "next/navigation";
import { getServices } from "../../../lib/catalog";
import { getServiceCategory } from "../../../components/ServiceMark";
import PageHero from "../../../components/PageHero";
export const dynamic = "force-dynamic";
export function generateMetadata({ params }) {
  const service = getServices().find((item) => item.slug === params.slug);
  return service
    ? {
        title: service.title,
        description: service.short,
        openGraph: { title: service.title, description: service.short },
      }
    : {};
}
export default function S({ params }) {
  const s = getServices().find((x) => x.slug === params.slug);
  if (!s) notFound();
  const category = getServiceCategory(s);
  const heroKind =
    category === "ai"
      ? "ai"
      : category === "research"
        ? "research"
        : category === "automation"
          ? "automation"
          : category === "design"
            ? "design"
            : category === "hybrid"
              ? "project"
              : "web";
  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-page px-7 pb-[90px] pt-[132px]">
      <PageHero
        eyebrow={
          category === "ai"
            ? "AI development"
            : category === "web"
              ? "Software engineering"
              : category === "hybrid"
                ? "AI + product engineering"
                : category === "research"
                  ? "Research & ML"
                  : category === "automation"
                    ? "Intelligent automation"
                    : "UI/UX engineering"
        }
        title={s.title}
        description={s.long}
        kind={heroKind}
        actions={
          <>
            <Link
              className="inline-flex items-center justify-center gap-[9px] rounded-full border border-[rgba(233,198,109,0.42)] bg-[linear-gradient(110deg,#397ed0,#2868b8)] px-5 py-[11px] text-[0.93rem] font-semibold text-white no-underline shadow-[0_8px_25px_rgba(39,105,190,0.24)] transition hover:-translate-y-0.5 hover:border-lab-gold hover:bg-[linear-gradient(110deg,#4c97f4,#3478cf)] hover:shadow-[0_10px_30px_rgba(39,105,190,0.36)]"
              href={"/project-builder?service=" + s.slug}
            >
              Configure your project
            </Link>
            <Link
              className="inline-flex items-center justify-center gap-[9px] rounded-full border border-[#30354e] bg-[rgba(13,16,32,0.7)] px-5 py-[11px] text-[0.93rem] font-semibold text-[#d9d9e7] no-underline transition hover:-translate-y-0.5 hover:border-lab-blue"
              href="/services"
            >
              Explore services
            </Link>
          </>
        }
      />
      <p className="mb-4 mt-5 font-semibold text-[#e7c96e]">
        {s.customQuote
          ? "Custom Quote" +
            (s.from
              ? ` · indicative ₹${s.from.toLocaleString("en-IN")}–₹${s.to.toLocaleString("en-IN")}${s.openEnded ? "+" : ""}`
              : "")
          : `Estimated ₹${s.from.toLocaleString("en-IN")} – ₹${s.to.toLocaleString("en-IN")}${s.openEnded ? "+" : ""}`}{" "}
        · about {s.days} days
      </p>
      <p className="mx-auto max-w-[760px] text-lab-muted">
        Final pricing depends on scope, design complexity, pages, features,
        integrations, backend requirements, AI complexity, deployment and
        timeline.
      </p>
      {s.studentEligible && (
        <p className="mx-auto mb-4 mt-4 inline-block rounded-full border border-[rgba(233,198,109,0.32)] bg-[rgba(233,198,109,0.08)] px-[11px] py-[6px] text-[0.78rem] font-bold text-lab-gold">
          25% Student Offer · available after student verification ·{" "}
          <Link
            className="text-lab-gold underline decoration-[rgba(233,198,109,0.45)] underline-offset-2 hover:text-lab-blue"
            href="/students"
          >
            Apply to the Student Program
          </Link>
        </p>
      )}
      <h2 className="mx-auto mb-4 mt-8 max-w-[760px] text-[clamp(1.9rem,3.6vw,3rem)]">
        What this can include
      </h2>
      <ul className="mx-auto mb-7 mt-0 max-w-[760px] list-disc pl-5 leading-[2]">
        {s.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <p className="mx-auto my-[26px] max-w-[860px] rounded-2xl border border-[rgba(233,198,109,0.2)] bg-[linear-gradient(110deg,rgba(233,198,109,0.07),rgba(76,151,244,0.045))] px-5 py-[17px] text-[0.88rem] text-[#bdc2d5] max-[680px]:text-[0.82rem]">
        Every project is built around your requirements. Prices shown are
        estimates, not fixed packages. No unnecessary subscriptions and no
        hidden development charges. Domain, hosting, database hosting, email,
        API usage, AI usage, storage, payment gateway and third-party software
        costs are separate when required and explained before work begins.
      </p>
    </main>
  );
}
