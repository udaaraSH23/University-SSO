const __FP_SIG = "FP-20251230-US-PAGE-OFFERINGS|HASH-PLACEHOLDER";

import { offeringService, programService } from "@repo/backend";
import { api } from "@/lib/api";
import { GradesOfferingsClient } from "@/components/offerings/GradesOfferingsClient";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function GradesOfferingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  let offeringsData: any = { data: [], metadata: { totalPages: 1, page: 1 } };
  let academicYears: string[] = [];
  let errorMsg = "";

  try {
    const academicYearsRes = await api.execute(() =>
      offeringService.getAcademicYears()
    );
    academicYears = academicYearsRes || [];

    const initialYear = academicYears.length > 0 ? academicYears[0] : undefined;

    const offeringsRes = await api.execute(() =>
      offeringService.getCourseOfferings({
        academicYear: initialYear,
        page: currentPage,
        limit: 10,
      })
    );

    offeringsData = offeringsRes;
  } catch (error: any) {
    console.error("Failed to fetch offerings data:", error);
    errorMsg = error.message;
  }

  if (errorMsg) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-lg">
        Error loading offerings: {errorMsg}
      </div>
    );
  }

  return (
    <GradesOfferingsClient
      initialOfferings={offeringsData}
      academicYears={academicYears}
    />
  );
}
