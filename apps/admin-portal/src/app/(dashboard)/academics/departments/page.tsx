import { organizationService } from "@repo/backend";
import { api } from "@/lib/api";
import { DepartmentsClient } from "@/components/departments/DepartmentsClient";

/**
 * DepartmentsPage
 *
 * Purpose:
 * - Server Component for Department management.
 * - Fetches initial list and faculties.
 */
export default async function DepartmentsPage() {
  let departments: any[] = [];
  let faculties: any[] = [];
  let errorMsg = "";

  try {
    const [departmentsRes, facultiesRes] = await api.execute(() =>
      Promise.all([
        organizationService.getDepartments(),
        organizationService.getFaculties(),
      ])
    );
    departments = departmentsRes;
    faculties = facultiesRes;
  } catch (error: any) {
    console.error("Failed to fetch data:", error);
    errorMsg = error.message;
  }

  if (errorMsg) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-lg">
        Error loading departments: {errorMsg}
      </div>
    );
  }

  return (
    <DepartmentsClient initialDepartments={departments} faculties={faculties} />
  );
}
