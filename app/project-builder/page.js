import { cookies } from "next/headers";
import {
  getPricingAdjustments,
  getServices,
  getStudentApplication,
} from "../../lib/catalog";
import ProjectBuilder from "../../components/ProjectBuilder";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Build a project | sparse.lab",
  description:
    "Combine sparse.lab services, share your brief and request a tailored project quote.",
};
export default function Page({ searchParams }) {
  const student = getStudentApplication(cookies().get("student_access")?.value);
  return (
    <ProjectBuilder
      services={getServices({ student: !!student })}
      adjustments={getPricingAdjustments()}
      initialService={searchParams?.service || ""}
      studentAuthorized={!!student}
    />
  );
}
