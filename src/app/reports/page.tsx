import ReportsIndexClient from "@/components/reports/ReportsIndexClient";
import { getReportsCatalog } from "@/lib/reports/catalog";

export const revalidate = 3600;

export default async function ReportsPage() {
  const reports = await getReportsCatalog();
  return <ReportsIndexClient reports={reports} />;
}
