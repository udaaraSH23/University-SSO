import {
  courseService,
  organizationService,
  programService,
} from "@repo/backend";
import { api } from "@/lib/api";
import { CoursesClient } from "@/components/courses/CoursesClient";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function CoursesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  let coursesData: { data: any[]; total: number } = { data: [], total: 0 };
  let faculties: any[] = [];
  let degrees: any[] = [];
  let errorMsg = "";

  try {
    const [coursesRes, facultiesRes, degreesRes] = await api.execute(() =>
      Promise.all([
        courseService.getCourses(
          undefined,
          currentPage,
          10,
          undefined,
          undefined
        ),
        organizationService.getFaculties(),
        programService.getDegreePrograms(),
      ])
    );

    coursesData = coursesRes;
    faculties = facultiesRes;
    degrees = degreesRes.data || []; // degreesRes returns paginated result, likely
  } catch (error: any) {
    console.error("Failed to fetch courses data:", error);
    errorMsg = error.message;
  }

  // Handle degrees data structure if it's paginated (likely is)
  // Check if degreesRes is array or object with data
  // Based on getDegreePrograms signature, it returns { data, total, page, limit }
  if (degrees && !Array.isArray(degrees) && (degrees as any).data) {
    degrees = (degrees as any).data;
  }

  if (errorMsg) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-lg">
        Error loading courses: {errorMsg}
      </div>
    );
  }

  return (
    <CoursesClient
      initialCourses={coursesData}
      faculties={faculties}
      degrees={degrees}
    />
  );
}
