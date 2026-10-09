import { notFound } from "next/navigation";
import { db } from "../../../lib/db";
import { STEPS } from "../../../lib/mail";
import { getServices } from "../../../lib/catalog";
import Thread from "../../../components/Thread";
import QuoteActions from "../../../components/QuoteActions";
import PageHero from "../../../components/PageHero";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Track request | sparse.lab",
  robots: { index: false },
};

const trackingPanelClasses =
  "min-w-0 overflow-hidden rounded-[18px] border border-[#97a3ca]/15 bg-[radial-gradient(ellipse_at_0_0,rgba(76,151,244,0.055),transparent_54%),linear-gradient(145deg,rgba(10,12,18,0.96),rgba(5,6,10,0.96))] p-7 shadow-[0_18px_50px_rgba(0,0,0,0.2),inset_0_1px_rgba(255,255,255,0.025)] max-[600px]:p-5";
const sectionLabelClasses =
  "mb-[18px] text-[0.72rem] font-bold uppercase leading-[1.4] tracking-[0.12em] text-[#c4c8d5]";
const cardTitleClasses =
  "mb-[18px] text-[1.2rem] font-bold tracking-[-0.02em] text-[#f1f2fa]";

export default function P({ params, searchParams }) {
  const o = db.prepare("select * from orders where code=?").get(params.code);
  if (!o) notFound();

  const services = getServices();
  const msgs = db
    .prepare("select * from messages where code=? order by id")
    .all(o.code);
  const s = services.find((x) => x.slug === o.service);
  const currentStepIndex = STEPS.indexOf(o.status);

  const selected = db
    .prepare("select service_slug,package_id from order_services where code=?")
    .all(o.code);

  const projectServices = selected
    .map((item) => ({
      service: services.find((service) => service.slug === item.service_slug),
      packageId: item.package_id,
    }))
    .filter((item) => item.service);

  const quote = db
    .prepare(
      "select * from quotes where code=? order by created_at desc,id desc limit 1",
    )
    .get(o.code);

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-page px-7 pb-[100px] pt-[132px] max-[760px]:px-[22px] max-[680px]:pt-[103px] max-[600px]:pb-[68px]">
      <div className="-mb-12">
        <PageHero
          eyebrow={"Project request · " + o.code}
          title={
            projectServices.length > 1
              ? "Your project request"
              : s?.title || "Project request"
          }
          description="Your request, estimate and project conversation in one place."
          kind="track"
          meta={"Current status · " + o.status.replaceAll("_", " ")}
        />
      </div>

      {/* Confirmation Notification */}
      {searchParams?.new && (
        <div className="mt-[30px] rounded-[15px] border border-[#e9c66d]/25 bg-[linear-gradient(110deg,rgba(233,198,109,0.07),rgba(76,151,244,0.045)),#080a0e] px-[22px] py-5 backdrop-blur-md max-[600px]:mt-[22px]">
          <h3 className="mb-[5px] text-base text-[#e9c66d]">
            Request received
          </h3>
          <p className="m-0 text-[0.86rem] leading-[1.6] text-[#c2c7d3]">
            {o.confirmation_sent
              ? "A confirmation was emailed to " + o.email + "."
              : "Your request is saved. Email confirmation is not configured yet."}{" "}
            Keep this private tracking link.
          </p>
        </div>
      )}

      {/* Status Stepper Progress */}
      <section
        className={`${trackingPanelClasses} mt-[30px] max-[600px]:mt-[22px]`}
      >
        <h3 className={sectionLabelClasses}>Project Workflow Progress</h3>
        <ol className="m-0 grid list-none grid-cols-4 gap-3 p-0 max-[600px]:grid-cols-2 max-[600px]:gap-[9px]">
          {STEPS.map((t, k) => {
            const isCompleted = k <= currentStepIndex;
            const isCurrent = k === currentStepIndex;

            return (
              <li
                key={t}
                aria-current={isCurrent ? "step" : undefined}
                data-completed={isCompleted ? "true" : "false"}
                className={`flex min-h-[88px] min-w-0 flex-col items-center justify-center gap-[5px] rounded-[13px] border px-2 py-3 text-center transition duration-200 max-[600px]:min-h-[78px] max-[600px]:px-1.5 max-[600px]:py-2 ${
                  isCurrent
                    ? "border-[#e9c66d]/50 bg-[radial-gradient(ellipse_at_50%_0,rgba(233,198,109,0.11),transparent_72%),rgba(12,12,14,0.85)] text-[#788194] shadow-[inset_0_0_22px_rgba(233,198,109,0.035)]"
                    : isCompleted
                      ? "border-[#4c97f4]/20 bg-[rgba(4,5,8,0.5)] text-[#c1c9d8]"
                      : "border-[#97a3ca]/10 bg-[rgba(4,5,8,0.5)] text-[#788194]"
                }`}
              >
                <span
                  className={`inline-flex h-[29px] w-[29px] flex-none items-center justify-center rounded-full border text-[0.72rem] font-bold ${
                    isCurrent
                      ? "border-transparent bg-gradient-to-br from-[#f1d47c] to-[#c39c48] text-[#12110d]"
                      : isCompleted
                        ? "border-[#97a3ca]/10 bg-[#4c97f4]/20 text-[#8fc0ff]"
                        : "border-[#97a3ca]/10 bg-[#97a3ca]/10 text-[#939bad]"
                  }`}
                >
                  {k + 1}
                </span>
                <span className="text-[0.8rem] font-semibold capitalize leading-[1.35]">
                  {t.replaceAll("_", " ")}
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      <div
        className={`mt-[30px] grid ${
          projectServices.length === 0 ? "grid-cols-1" : "grid-cols-2"
        } gap-5 max-[600px]:grid-cols-1 max-[600px]:gap-[14px] max-[600px]:mt-[22px]`}
      >
        {/* Estimate Card */}
        <section
          className={`${trackingPanelClasses} flex min-h-[230px] flex-col justify-between gap-[22px] bg-[radial-gradient(ellipse_at_100%_0,rgba(233,198,109,0.075),transparent_48%),linear-gradient(145deg,rgba(10,12,18,0.96),rgba(5,6,10,0.96))]`}
        >
          <div>
            <p className={`${sectionLabelClasses} mb-[18px] text-[#8fc0ff]`}>
              Indicative project estimate
            </p>
            <h2 className="m-0 break-words text-[clamp(2rem,4vw,2.8rem)] font-bold leading-[1.2] tracking-[-0.045em] text-[#f0d37c]">
              ₹{(o.normal_estimate_min || o.total).toLocaleString("en-IN")} – ₹
              {(
                o.normal_estimate_max ||
                o.estimated_max ||
                o.total
              ).toLocaleString("en-IN")}
            </h2>

            {o.student_discount_percent > 0 && (
              <div className="mt-[18px] rounded-xl border border-[#e9c66d]/20 bg-[#e9c66d]/[0.06] p-[13px_15px] text-[0.88rem] leading-[1.55] text-[#e9c66d]">
                <span className="font-semibold">25% Student Offer</span> ·
                estimated student price{" "}
                <strong className="text-white">
                  ₹{o.total.toLocaleString("en-IN")} – ₹
                  {(o.estimated_max || o.total).toLocaleString("en-IN")}
                </strong>
              </div>
            )}
          </div>

          <p className="m-0 border-t border-[#97a3ca]/[0.12] pt-[17px] text-[0.78rem] leading-[1.7] text-[#a0a4b6]">
            This is an estimate, not a binding quote. We’ll confirm scope and
            final price after review. Timeline preference:{" "}
            <span className="font-semibold text-[#e0e3ec]">
              {o.timeline === "target" ? "Target date requested" : "Flexible"}
            </span>
            .
          </p>
        </section>

        {/* Requested Services */}
        {projectServices.length > 0 && (
          <section className={trackingPanelClasses}>
            <h2 className={cardTitleClasses}>Services in this request</h2>
            <div className="grid gap-2.5">
              {projectServices.map(({ service }) => (
                <div
                  key={service.slug}
                  className="flex items-center justify-between gap-3.5 rounded-xl border border-[#97a3ca]/10 bg-[rgba(4,5,8,0.45)] p-[15px] max-[600px]:items-start max-[600px]:flex-col max-[600px]:gap-[9px]"
                >
                  <strong className="text-[0.9rem] font-semibold text-[#e0e3ec]">
                    {service.title}
                  </strong>
                  <span className="whitespace-nowrap rounded-full border border-[#97a3ca]/[0.12] bg-[#97a3ca]/[0.07] px-[9px] py-[5px] text-[0.68rem] leading-[1.35] text-[#a0a4b6]">
                    Requirement-based scope
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Binding Quote Section */}
      {quote && (
        <section
          className={`${trackingPanelClasses} mt-[30px] grid gap-[18px] max-[600px]:mt-[22px]`}
        >
          <div className="flex items-start justify-between gap-[18px] border-b border-[#97a3ca]/[0.12] pb-5 max-[600px]:flex-col max-[600px]:gap-3">
            <div>
              <p className={`${sectionLabelClasses} mb-[7px] text-[#8fc0ff]`}>
                Project quote
              </p>
              <h2 className="m-0 text-[2rem] leading-[1.2] text-[#f1f2fa]">
                ₹{quote.amount.toLocaleString("en-IN")}{" "}
                <span className="text-[0.95rem] font-normal text-[#a0a4b6]">
                  {quote.currency}
                </span>
              </h2>
            </div>
            <span
              className={`rounded-full border px-[11px] py-[7px] text-[0.7rem] font-bold uppercase tracking-[0.08em] ${
                quote.status === "accepted"
                  ? "border-[#4c97f4]/[0.28] bg-[#4c97f4]/10 text-[#8fc0ff]"
                  : quote.status === "rejected"
                    ? "border-[#ff6e82]/25 bg-[#ff6e82]/[0.08] text-[#ff9aa8]"
                    : "border-[#e9c66d]/25 bg-[#e9c66d]/[0.08] text-[#e9c66d]"
              }`}
            >
              {quote.status}
            </span>
          </div>

          <p className="m-0 text-[0.92rem] leading-[1.75] text-[#c4c8d5]">
            {quote.scope}
          </p>

          {quote.status === "pending" && (
            <div className="pt-2">
              <QuoteActions code={o.code} quoteId={quote.id} />
            </div>
          )}
          {quote.status === "accepted" && (
            <p className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 text-xs font-medium text-emerald-300">
              Quote accepted. We’ll be in touch about next steps; no payment has
              been processed.
            </p>
          )}
          {quote.status === "rejected" && (
            <p className="text-xs text-slate-400">
              You declined this quote. The team can review the scope and follow
              up with you.
            </p>
          )}
        </section>
      )}

      {/* Message Thread Container */}
      <section
        className={`${trackingPanelClasses} mt-[30px] max-[600px]:mt-[22px]`}
      >
        <h2 className={`${cardTitleClasses} mb-[22px]`}>Project messages</h2>
        <Thread code={o.code} msgs={msgs} />
      </section>
    </main>
  );
}
