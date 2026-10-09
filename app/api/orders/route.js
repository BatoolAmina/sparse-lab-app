import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { db } from "../../../lib/db";
import { mail, ADMIN } from "../../../lib/mail";
import {
  getPricingAdjustments,
  getServices,
  getStudentApplication,
} from "../../../lib/catalog";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const budgetRanges = new Set([
  "under-25000",
  "25000-50000",
  "50000-100000",
  "100000-plus",
  "not-sure",
]);

export async function POST(req) {
  if (Number(req.headers.get("content-length") || 0) > 25000)
    return NextResponse.json(
      { error: "Project details are too large." },
      { status: 413 },
    );
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Please submit a valid project request." },
      { status: 400 },
    );
  }

  const requested = Array.isArray(body.services)
    ? body.services
    : body.service
      ? [body.service]
      : [];
  if (!requested.length || requested.length > 6)
    return NextResponse.json(
      { error: "Choose between one and six services." },
      { status: 400 },
    );
  const services = getServices(),
    chosen = [],
    seen = new Set();
  for (const item of requested) {
    const slug = typeof item === "string" ? item : item?.slug;
    const service = services.find((entry) => entry.slug === slug);
    if (!service || seen.has(slug))
      return NextResponse.json(
        { error: "One or more selected services are invalid." },
        { status: 400 },
      );
    if (
      typeof item === "object" &&
      item?.packageId &&
      item.packageId !== "custom"
    )
      return NextResponse.json(
        {
          error:
            "Fixed service packages are no longer available. Please submit requirement-based scope.",
        },
        { status: 400 },
      );
    seen.add(slug);
    chosen.push({ service });
  }

  const name = String(body.name || "")
    .trim()
    .slice(0, 80);
  const email = String(body.email || "")
    .trim()
    .toLowerCase()
    .slice(0, 120);
  const details = String(body.details || "")
    .trim()
    .slice(0, 5000);
  const projectName = String(body.projectName || "")
    .trim()
    .slice(0, 120);
  const timeline = body.timeline;
  const budgetRange = body.budgetRange || "not-sure";
  if (!name || !emailPattern.test(email) || details.length < 10)
    return NextResponse.json(
      {
        error:
          "Add your name, a valid email and at least 10 characters about your project.",
      },
      { status: 400 },
    );
  if (!["flexible", "target"].includes(timeline))
    return NextResponse.json(
      { error: "Choose a valid timeline preference." },
      { status: 400 },
    );
  if (!budgetRanges.has(budgetRange))
    return NextResponse.json(
      { error: "Choose a valid budget range." },
      { status: 400 },
    );

  const rawReference = String(body.referenceUrl || "")
    .trim()
    .slice(0, 2048);
  let referenceUrl = "";
  if (rawReference) {
    try {
      const parsed = new URL(rawReference);
      if (!["http:", "https:"].includes(parsed.protocol))
        throw new Error("Invalid protocol");
      referenceUrl = parsed.toString();
    } catch {
      return NextResponse.json(
        { error: "Reference links must be valid http or https URLs." },
        { status: 400 },
      );
    }
  }

  const requirements =
    body.requirements && typeof body.requirements === "object"
      ? body.requirements
      : {};
  const pages = Number(requirements.pages);
  const adjustmentIds = Array.isArray(requirements.adjustments)
    ? [...new Set(requirements.adjustments)]
    : [];
  if (
    !Number.isInteger(pages) ||
    pages < 1 ||
    pages > 100 ||
    adjustmentIds.length > 20 ||
    adjustmentIds.some((id) => typeof id !== "string")
  )
    return NextResponse.json(
      { error: "Provide valid project estimator requirements." },
      { status: 400 },
    );
  const adjustmentMap = new Map(
    getPricingAdjustments().map((item) => [item.id, item]),
  );
  if (adjustmentIds.some((id) => id !== "extra-page" && !adjustmentMap.has(id)))
    return NextResponse.json(
      { error: "One or more estimator requirements are no longer available." },
      { status: 400 },
    );
  const extraPage = adjustmentMap.get("extra-page"),
    extraPages = Math.max(0, pages - 1);
  if (extraPages && !extraPage)
    return NextResponse.json(
      {
        error: "The additional-page estimator option is currently unavailable.",
      },
      { status: 409 },
    );
  const selectedAdjustments = adjustmentIds
    .filter((id) => id !== "extra-page")
    .map((id) => adjustmentMap.get(id));
  const student = getStudentApplication(cookies().get("student_access")?.value);
  if (student && email !== student.email.toLowerCase())
    return NextResponse.json(
      {
        error:
          "Use the email address approved for your Student Program access.",
      },
      { status: 403 },
    );
  const baseMin =
    chosen.reduce((sum, { service }) => sum + service.from, 0) +
    (extraPage?.min_amount || 0) * extraPages +
    selectedAdjustments.reduce((sum, item) => sum + item.min_amount, 0);
  const baseMax =
    chosen.reduce((sum, { service }) => sum + service.to, 0) +
    (extraPage?.max_amount || 0) * extraPages +
    selectedAdjustments.reduce((sum, item) => sum + item.max_amount, 0);
  const studentPricing =
    !!student &&
    chosen.some(({ service }) => service.from > 0) &&
    chosen.every(({ service }) => service.studentEligible);
  const discountMin = studentPricing ? Math.round(baseMin * 0.25) : 0,
    discountMax = studentPricing ? Math.round(baseMax * 0.25) : 0;
  const estimateMin = baseMin - discountMin,
    estimateMax = baseMax - discountMax;
  const customRequired = chosen.some(({ service }) => service.customQuote);
  const code = "SL-" + crypto.randomBytes(8).toString("hex").toUpperCase();
  const serviceNames = chosen.map(({ service }) => service.title);
  const targetDate = String(body.targetDate || "").slice(0, 10);
  if (targetDate && !/^\d{4}-\d{2}-\d{2}$/.test(targetDate))
    return NextResponse.json(
      { error: "Enter a valid target date." },
      { status: 400 },
    );
  const requirementNames = selectedAdjustments
    .map(
      (item) =>
        `${item.label}: ₹${item.min_amount.toLocaleString("en-IN")}–₹${item.max_amount.toLocaleString("en-IN")}`,
    )
    .join(", ");
  const fullDetails = [
    projectName && `Project: ${projectName}`,
    `Budget range: ${budgetRange.replaceAll("-", " ")}`,
    referenceUrl && `Reference: ${referenceUrl}`,
    `Services: ${serviceNames.join("; ")}`,
    `Estimated pages: ${pages}`,
    requirementNames && `Additional requirements: ${requirementNames}`,
    `Timeline preference: ${timeline}${targetDate ? " · target " + targetDate : ""}`,
    `Indicative estimate: ₹${baseMin.toLocaleString("en-IN")}–₹${baseMax.toLocaleString("en-IN")}${studentPricing ? ` · 25% student discount · estimated student price ₹${estimateMin.toLocaleString("en-IN")}–₹${estimateMax.toLocaleString("en-IN")}` : ""}`,
    customRequired ? "Custom quote required for selected complex scope." : null,
    details,
  ]
    .filter(Boolean)
    .join("\n\n");
  const now = new Date().toISOString();
  const createRequest = db.transaction(() => {
    db.prepare(
      "insert into orders(code,service,name,email,timeline,addons,total,details,status,at,budget_range,reference_url,student_pricing_applied,estimated_max,normal_estimate_min,normal_estimate_max,student_discount_percent) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    ).run(
      code,
      chosen[0].service.slug,
      name,
      email,
      timeline,
      "[]",
      estimateMin,
      fullDetails,
      "new",
      now,
      budgetRange,
      referenceUrl,
      studentPricing ? 1 : 0,
      estimateMax,
      baseMin,
      baseMax,
      studentPricing ? 25 : 0,
    );
    const addService = db.prepare(
      "insert into order_services(code,service_slug,package_id) values(?,?,?)",
    );
    for (const { service } of chosen)
      addService.run(code, service.slug, "custom");
  });
  createRequest();

  const link =
    (process.env.SITE_URL || "http://localhost:3000") + "/track/" + code;
  const estimate = `Indicative estimate: ₹${estimateMin.toLocaleString("en-IN")}–₹${estimateMax.toLocaleString("en-IN")}${studentPricing ? ` after the 25% Student Offer` : ""}${customRequired ? " · selected work requires a custom quote" : ""}. Final pricing depends on scope and complexity.`;
  const [, confirmationSent] = await Promise.all([
    mail(
      ADMIN,
      `[sparse.lab] New project request ${code}`,
      `${name} <${email}>\n${serviceNames.join("\n")}\n${estimate}\nTimeline: ${timeline}\n${referenceUrl ? "Reference: " + referenceUrl + "\n" : ""}\n${fullDetails}\n\n${link}`,
    ),
    mail(
      email,
      `We received your project request ${code}`,
      `Hi ${name},\n\nThanks for reaching out to sparse.lab. Your project request is in and our team will review it.\n\n${serviceNames.join("\n")}\n${estimate}\nTrack your request and message us here: ${link}`,
    ),
  ]);
  db.prepare("update orders set confirmation_sent=? where code=?").run(
    confirmationSent ? 1 : 0,
    code,
  );
  return NextResponse.json(
    {
      code,
      estimate: {
        min: estimateMin,
        max: estimateMax,
        normalMin: baseMin,
        normalMax: baseMax,
        studentDiscount: studentPricing ? 25 : 0,
      },
    },
    { status: 201 },
  );
}
