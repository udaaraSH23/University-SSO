"use client";

import {
  DashboardHeader,
  SlideOver,
  Pagination,
  useDeleteConfirmation,
} from "@repo/ui";
import { FilterWrapper } from "@/components/shared/FilterWrapper";
import {
  CourseOfferingsTable,
  CourseOffering,
} from "@/components/offerings/CourseOfferingsTable";
import {
  getCourseOfferingsAction,
  createCourseOfferingAction,
  updateCourseOfferingAction,
  deleteCourseOfferingAction,
} from "@/actions/offering.actions";
import {
  OfferingForm,
  OfferingFormData,
} from "@/components/forms/OfferingForm";
import { Plus, Search, Filter as FilterIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface PaginatedOfferings {
  data: CourseOffering[];
  metadata: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}

interface GradesOfferingsClientProps {
  initialOfferings: PaginatedOfferings;
  academicYears: string[];
}

export function GradesOfferingsClient({
  initialOfferings,
  academicYears,
}: GradesOfferingsClientProps) {
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [editingOffering, setEditingOffering] = useState<
    (OfferingFormData & { id?: number }) | undefined
  >(undefined);
  const { confirmDelete } = useDeleteConfirmation();
  const searchParams = useSearchParams();

  // Filter State
  const [yearFilter, setYearFilter] = useState(
    academicYears.length > 0 ? academicYears[0] : "All Years"
  );
  const [semesterFilter, setSemesterFilter] = useState<number | undefined>(
    undefined
  );
  const [levelFilter, setLevelFilter] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  // Data State
  const [offerings, setOfferings] = useState<CourseOffering[]>(
    initialOfferings?.data || []
  );
  const [currentPage, setCurrentPage] = useState(
    initialOfferings?.metadata?.page || 1
  );
  const [totalPages, setTotalPages] = useState(
    initialOfferings?.metadata?.totalPages || 1
  );
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Offerings on Filter/Page Change
  const fetchOfferings = async (
    page: number,
    overrideFilters?: { academicYear?: string }
  ) => {
    setIsLoading(true);
    const response = await getCourseOfferingsAction({
      academicYear: overrideFilters?.academicYear ?? yearFilter,
      semester: semesterFilter,
      level: levelFilter,
      search: searchTerm,
      page: page,
      limit: 10,
    });

    if (response.success && "data" in response && response.data) {
      setOfferings(response.data);
      setTotalPages(response.metadata?.totalPages || 1);
      setCurrentPage(response.metadata?.page || 1);
    }
    setIsLoading(false);
  };

  // Unlike the original, we don't need a mounting useEffect to fetch initial data
  // because it's passed in as props.
  // However, we do need to handle filter changes.

  /* 
  Original logic had:
  useEffect(() => { initializePage() }, [])
  initializePage did: fetchYears -> setYears -> fetchOfferings
  
  Now:
  Years passed in props.
  Offerings passed in props (fetched based on default logic on server).
  */

  const handleFilter = () => {
    fetchOfferings(1); // Reset to page 1 on manual filter
  };

  const handlePageChange = (page: number) => {
    fetchOfferings(page);
  };

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "add") {
      const timer = setTimeout(() => {
        setEditingOffering(undefined);
        setIsSlideOverOpen(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleOpenAdd = () => {
    setEditingOffering(undefined);
    setIsSlideOverOpen(true);
  };

  const handleClose = () => {
    setIsSlideOverOpen(false);
    setEditingOffering(undefined);
  };

  const handleSubmit = async (data: OfferingFormData) => {
    try {
      let response;
      if (editingOffering?.id) {
        response = await updateCourseOfferingAction(editingOffering.id, {
          semester: Number(data.semester),
          academicYear: data.academicYear,
          level: Number(data.level),
        });
      } else {
        response = await createCourseOfferingAction({
          courseId: parseInt(data.course),
          semester: Number(data.semester),
          academicYear: data.academicYear,
          level: Number(data.level),
        });
      }

      if (response.success) {
        toast.success(
          editingOffering?.id
            ? "Offering updated successfully!"
            : "Offering created successfully!"
        );
        handleClose();
        fetchOfferings(currentPage); // Refresh list
      } else {
        toast.error("Error: " + (response.error || "Operation failed"));
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleDeleteClick = (offering: CourseOffering) => {
    confirmDelete({
      title: "Delete Course Offering",
      description: `Are you sure you want to delete the offering for "${offering.courseCode} - ${offering.courseName}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const response = await deleteCourseOfferingAction(offering.id);
          if (response.success) {
            toast.success("Offering deleted successfully");
            fetchOfferings(currentPage);
          } else {
            toast.error(response.error || "Failed to delete offering");
          }
        } catch (error) {
          console.error("Delete error:", error);
          toast.error("An unexpected error occurred during deletion");
        }
      },
    });
  };

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Course Offerings"
        description="Manage active course offerings, assignments, and grades."
        breadcrumb={[
          { label: "Grades & Offerings", href: "/grades-offerings" },
        ]}
      >
        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Offering
        </button>
      </DashboardHeader>

      <FilterWrapper
        title="Filter Offerings"
        searchNode={
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by course..."
              className="w-full pl-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 outline-none"
            />
          </div>
        }
        actions={
          <>
            <button
              onClick={() => fetchOfferings(1)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
            <button
              onClick={handleFilter}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap cursor-pointer"
            >
              <FilterIcon className="w-3.5 h-3.5" />
              Filter
            </button>
          </>
        }
      >
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Level
          </label>
          <select
            value={levelFilter || ""}
            onChange={(e) =>
              setLevelFilter(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 outline-none"
          >
            <option value="">All Levels</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Academic Year
          </label>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 outline-none"
          >
            <option value="All Years">All Years</option>
            {academicYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Semester
          </label>
          <select
            value={semesterFilter || ""}
            onChange={(e) =>
              setSemesterFilter(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 outline-none"
          >
            <option value="">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
        </div>
      </FilterWrapper>

      <div className="mt-4">
        {isLoading ? (
          <div className="text-center py-20 text-gray-500">
            Loading offerings...
          </div>
        ) : (
          <CourseOfferingsTable
            offerings={offerings}
            onEdit={(offering) => {
              setEditingOffering({
                id: offering.id,
                course: offering.courseId.toString(), // Use stored ID
                semester:
                  typeof offering.semester === "string"
                    ? parseInt(
                        (offering.semester as string).replace("Semester ", "")
                      )
                    : Number(offering.semester),
                academicYear: offering.academicYear || "",
                level: offering.level || 1,
              });
              setIsSlideOverOpen(true);
            }}
            onDelete={(offering) => handleDeleteClick(offering)}
          />
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <SlideOver
        isOpen={isSlideOverOpen}
        onClose={handleClose}
        title={editingOffering ? "Edit Offering" : "Create New Offering"}
        description={
          editingOffering
            ? "Update details of the course offering."
            : "Open a course for enrollment in a specific semester."
        }
      >
        <OfferingForm
          initialData={editingOffering}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </SlideOver>
    </div>
  );
}
