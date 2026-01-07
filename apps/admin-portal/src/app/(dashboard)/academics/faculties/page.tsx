import { organizationService } from "@repo/backend";
import { api } from "@/lib/api";
import { FacultiesClient } from "@/components/academics/FacultiesClient";

/**
 * FacultiesPage
 *
 * Purpose:
 * - Server Component acting as data container.
 * - Fetches initial faculties list via `api.execute`.
 */
export default async function FacultiesPage() {
  let faculties: any[] = [];
  let errorMsg = "";

  try {
    faculties = await api.execute(() => organizationService.getFaculties());
  } catch (error: any) {
    console.error("Failed to fetch faculties:", error);
    errorMsg = error.message;
  }

  if (errorMsg) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-lg">
        Error loading faculties: {errorMsg}
      </div>
    );
  }

  return <FacultiesClient initialFaculties={faculties} />;
}
