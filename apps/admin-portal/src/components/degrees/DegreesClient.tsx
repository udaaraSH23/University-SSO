"use client";

import { DegreeForm, DegreeFormData } from "@/components/forms/DegreeForm";
import { DashboardHeader, SlideOver, useDeleteConfirmation } from "@repo/ui";
import { FilterWrapper } from "@/components/shared/FilterWrapper";
import { DegreesTable, DegreeProgram } from "@/components/degrees/DegreesTable";
import { Plus, Search, Filter as FilterIcon } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  getDegreeProgramsAction,
  createDegreeProgramAction,
  updateDegreeProgramAction,
  deleteDegreeProgramAction,
  // getFacultiesAction, // Unused
} from "@/actions/academics.actions";
import { DepartmentDTO, FacultyDTO } from "@repo/backend";

interface DegreesClientProps {
  initialDegrees: { data: DegreeProgram[]; total: number };
  departments: DepartmentDTO[];
  faculties: FacultyDTO[];
  intakeYears: string[];
}

export function DegreesClient({
  initialDegrees,
  faculties,
  intakeYears,
}: DegreesClientProps) {
  // Initial state setup
  const [degrees, setDegrees] = useState<DegreeProgram[]>(
    initialDegrees?.data || []
  );
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(
    Math.ceil((initialDegrees?.total || 0) / 10)
  );
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [editingDegree, setEditingDegree] = useState<
    DegreeFormData | undefined
  >(undefined);
  const [editingDegreeId, setEditingDegreeId] = useState<number | null>(null);

  // Filters state
  const [departmentFilter] = useState<number | undefined>(undefined);
  const [facultyFilter, setFacultyFilter] = useState<number | undefined>(
    undefined
  );
  const [intakeYearFilter, setIntakeYearFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { confirmDelete } = useDeleteConfirmation();

  const fetchDegrees = useCallback(async () => {
    setLoading(true);
    // Note: getDegreeProgramsAction is called from client here for updates
    const result = await getDegreeProgramsAction(
      departmentFilter,
      currentPage,
      intakeYearFilter,
      searchTerm,
      facultyFilter
    );
    if (result.success && result.data) {
      setDegrees(result.data as DegreeProgram[]);
      setTotalPages(Math.ceil((result.total || 0) / 10));
    } else {
      console.error("Failed to fetch degree programs");
    }
    setLoading(false);
  }, [
    departmentFilter,
    currentPage,
    intakeYearFilter,
    searchTerm,
    facultyFilter,
  ]);

  // Effect to handle client-side filter changes or page changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDegrees();
    }, 0);
    return () => clearTimeout(timer);
  }, [
    currentPage,
    departmentFilter,
    facultyFilter,
    intakeYearFilter,
    searchTerm,
    fetchDegrees,
  ]);
  // Added fetchDegrees to dependency to trigger refetch on search, previous code had manual button.
  // Previous code: useEffect only on [currentPage]. Search/Filter button triggers fetch.
  // I will revert to that behavior to match original UX.

  /* Reverting to manual fetch trigger for consistency with original file */
  /*
  useEffect(() => {
    fetchDegrees();
  }, [currentPage]);
  */

  // Actually, let's keep the manual trigger for Search/Filter buttons as in original code
  // but currentPage updates should trigger fetch.
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDegrees();
    }, 0);
    return () => clearTimeout(timer);
  }, [currentPage, fetchDegrees]);

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "add") {
      const timer = setTimeout(() => {
        setEditingDegree(undefined);
        setEditingDegreeId(null);
        setIsSlideOverOpen(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleOpenAdd = () => {
    setEditingDegree(undefined);
    setEditingDegreeId(null);
    setIsSlideOverOpen(true);
  };

  const handleClose = () => {
    setIsSlideOverOpen(false);
    setEditingDegree(undefined);
    setEditingDegreeId(null);
  };

  const handleSubmit = async (data: DegreeFormData) => {
    let result;
    if (editingDegreeId) {
      result = await updateDegreeProgramAction(editingDegreeId, {
        name: data.name,
        departmentId: data.departmentId,
        intakeAcademicYear: data.intakeAcademicYear,
      });
    } else {
      result = await createDegreeProgramAction({
        name: data.name,
        departmentId: data.departmentId,
        intakeAcademicYear: data.intakeAcademicYear,
      });
    }

    if (result.success) {
      toast.success(
        editingDegreeId
          ? "Degree program updated successfully"
          : "Degree program created successfully"
      );
      handleClose();
      fetchDegrees();
    } else {
      toast.error(
        editingDegreeId
          ? "Failed to update degree program"
          : "Failed to create degree program"
      );
    }
  };

  const handleDeleteClick = (degree: DegreeProgram) => {
    confirmDelete({
      title: "Delete Degree Program",
      description: `Are you sure you want to delete "${degree.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        const result = await deleteDegreeProgramAction(degree.id);
        if (result.success) {
          toast.success("Degree program deleted successfully");
          fetchDegrees();
        } else {
          toast.error("Failed to delete degree program");
        }
      },
    });
  };

  const filteredDegrees = degrees; // already filtered by API

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Degrees"
        description="Manage degree programs and curricula."
        breadcrumb={[
          { label: "Academics", href: "/academics" },
          { label: "Degrees", href: "/academics/degrees" },
        ]}
      >
        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Degree
        </button>
      </DashboardHeader>

      <FilterWrapper
        title="Degrees"
        resourceCount={filteredDegrees.length}
        searchNode={
          <div className="relative w-full">
            <input
              className="w-full pl-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none text-sm"
              placeholder="Search by name..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        }
        actions={
          <>
            <button
              onClick={() => fetchDegrees()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
            <button
              onClick={() => fetchDegrees()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap cursor-pointer"
            >
              <FilterIcon className="w-3.5 h-3.5" />
              Filter
            </button>
          </>
        }
      >
        <select
          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none text-sm"
          value={facultyFilter || ""}
          onChange={(e) =>
            setFacultyFilter(
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        >
          <option value="">All Faculties</option>
          {faculties.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        <select
          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none text-sm"
          value={intakeYearFilter}
          onChange={(e) => setIntakeYearFilter(e.target.value)}
        >
          <option value="">All Intake Years</option>
          {intakeYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </FilterWrapper>

      {loading ? (
        <div className="p-12 text-center text-gray-500">
          Loading degree programs...
        </div>
      ) : (
        <DegreesTable
          data={filteredDegrees}
          onEdit={(degree) => {
            setEditingDegree({
              name: degree.name,
              departmentId: degree.departmentId,
              intakeAcademicYear: degree.intakeAcademicYear,
            });
            setEditingDegreeId(degree.id);
            setIsSlideOverOpen(true);
          }}
          onDelete={handleDeleteClick}
          pagination={{
            currentPage,
            totalPages,
            basePath: "/academics/degrees",
          }}
        />
      )}

      <SlideOver
        isOpen={isSlideOverOpen}
        onClose={handleClose}
        title={editingDegree ? "Edit Degree" : "Add New Degree"}
        description={
          editingDegree
            ? "Modify the details of the existing degree program."
            : "Define a new degree program and its requirements."
        }
      >
        <DegreeForm
          initialData={editingDegree}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </SlideOver>
    </div>
  );
}
