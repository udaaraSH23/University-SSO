import { programService, organizationService } from "@repo/backend";
import { api } from "@/lib/api";
import { DegreesClient } from "@/components/degrees/DegreesClient";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function DegreesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  let degreesData: { data: any[]; total: number } = { data: [], total: 0 };
  let departments: any[] = [];
  let faculties: any[] = [];
  let intakeYears: string[] = [];
  let errorMsg = "";

  try {
    const [degreesRes, departmentsRes, facultiesRes, intakeYearsRes] =
      await api.execute(() =>
        Promise.all([
          programService.getDegreePrograms(
            undefined,
            currentPage,
            10,
            undefined,
            undefined,
            undefined
          ),
          organizationService.getDepartments(),
          organizationService.getFaculties(),
          programService.getDistinctIntakeYears(),
        ])
      );

    degreesData = degreesRes;
    departments = departmentsRes;
    faculties = facultiesRes;
    intakeYears = intakeYearsRes;
  } catch (error: any) {
    console.error("Failed to fetch degree data:", error);
    errorMsg = error.message;
  }

  if (errorMsg) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-lg">
        Error loading degrees: {errorMsg}
      </div>
    );
  }

  return (
    <DegreesClient
      initialDegrees={degreesData}
      departments={departments}
      faculties={faculties}
      intakeYears={intakeYears}
    />
  );
}
