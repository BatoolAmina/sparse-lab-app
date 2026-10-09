import Link from "next/link";
import { getServices } from "../../lib/catalog";
import ServiceBrowser from "../../components/ServiceBrowser";
import { serviceGroups } from "../../lib/service-groups";
import PageHero from "../../components/PageHero";
export const dynamic = "force-dynamic";
export const metadata = { title: "Services | sparse.lab" };
export default function S({ searchParams }) {
  const services = getServices();
  const candidate = searchParams?.category || "";
  const initialCategory = serviceGroups.some((group) => group.id === candidate)
    ? candidate
    : "";
  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-[1600px] px-7 pb-[90px] pt-[132px]">
      <PageHero
        eyebrow="Service marketplace"
        title="Explore the systems"
        highlight="you can build."
        description="Research, intelligence and engineering, brought together around the work you need. Explore a discipline, compare estimates, then shape a project that fits."
        kind="services"
        actions={
          <>
            <Link
              className="inline-flex items-center justify-center gap-[9px] rounded-full border border-[rgba(233,198,109,0.42)] bg-[linear-gradient(110deg,#397ed0,#2868b8)] px-5 py-[11px] text-[0.93rem] font-semibold text-white no-underline shadow-[0_8px_25px_rgba(39,105,190,0.24)] transition hover:-translate-y-0.5 hover:border-lab-gold hover:bg-[linear-gradient(110deg,#4c97f4,#3478cf)] hover:shadow-[0_10px_30px_rgba(39,105,190,0.36)]"
              href="/project-builder"
            >
              Build a project <span aria-hidden="true">↗</span>
            </Link>
            <a
              className="inline-flex items-center justify-center gap-[9px] rounded-full border border-[#30354e] bg-[rgba(13,16,32,0.7)] px-5 py-[11px] text-[0.93rem] font-semibold text-[#d9d9e7] no-underline transition hover:-translate-y-0.5 hover:border-lab-blue"
              href="#service-catalog"
            >
              Explore services <span aria-hidden="true">↓</span>
            </a>
          </>
        }
      />
      <div id="service-catalog" className="scroll-mt-[94px]">
        <ServiceBrowser services={services} initialCategory={initialCategory} />
      </div>
    </main>
  );
}
