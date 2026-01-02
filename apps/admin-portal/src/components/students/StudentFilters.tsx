"use client";

// Author: UDARA SHANUKA
// Project: University-Portal
// FP-ID: FP-20260101-ADMIN-STUDENT-FILTERS-V2
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-01T10:41:39+05:30

const __FP_SIG = "FP-20260101-ADMIN-STUDENT-FILTERS-V2|HASH-PLACEHOLDER";

import { Search, Filter as FilterIcon } from "lucide-react";
import { FilterWrapper } from "@repo/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { FacultyDTO, DepartmentDTO } from "@repo/backend";
import { getDepartmentsAction } from "@/actions/academics.actions";

/**
 * StudentFilters
 *
 * Purpose:
 * - Provides a user interface for filtering students by various criteria (Faculty, Department, Level, Academic Year).
 * - Includes a keyword search for name, ID, or email.
 * - Dynamically fetches departments based on the selected faculty.
 *
 * Responsibilities:
 * - Synchronizing local filter state with the current URL search parameters.
 * - Updating the URL with new search parameters for filtering or searching.
 * - Managing local state for dynamically fetched departments.
 */

interface StudentFiltersProps {
  faculties: FacultyDTO[];
  academicYears: string[];
}

export function StudentFilters({
  faculties,
  academicYears,
}: StudentFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state for dynamically fetched departments
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [isLoadingDepts, setIsLoadingDepts] = useState(false);

  // Initialize filter state from URL search parameters
  const [filters, setFilters] = useState({
    query: searchParams.get("query") || "",
    level: searchParams.get("level") || "",
    faculty: searchParams.get("faculty") || "",
    department: searchParams.get("department") || "",
    academicYear: searchParams.get("academicYear") || "",
  });

  // Fetch departments when the selected faculty changes
  // Inline Comment: This ensures the department dropdown only shows relevant options.
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!filters.faculty) {
        setDepartments([]);
        return;
      }

      setIsLoadingDepts(true);
      try {
        const result = await getDepartmentsAction(parseInt(filters.faculty));
        if (result.success && result.data) {
          setDepartments(result.data);
        } else {
          setDepartments([]);
        }
      } catch (error) {
        console.error("Failed to fetch departments:", error);
        setDepartments([]);
      } finally {
        setIsLoadingDepts(false);
      }
    };

    fetchDepartments();
  }, [filters.faculty]);

  /**
   * handleFilter
   *
   * Purpose:
   * - Updates the URL with the current selection of dropdown filters.
   * - Keeps the current keyword query if present.
   */
  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Set or remove dropdown filters
    if (filters.level) params.set("level", filters.level);
    else params.delete("level");
    if (filters.faculty) params.set("faculty", filters.faculty);
    else params.delete("faculty");
    if (filters.department) params.set("department", filters.department);
    else params.delete("department");
    if (filters.academicYear) params.set("academicYear", filters.academicYear);
    else params.delete("academicYear");

    // Always reset to page 1 on filter change
    params.set("page", "1");

    startTransition(() => {
      router.push(`/students?${params.toString()}`);
    });
  };

  /**
   * handleSearch
   *
   * Purpose:
   * - Updates the URL based on the keyword search input.
   * - Keeps existing dropdown filters.
   */
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (filters.query) params.set("query", filters.query);
    else params.delete("query");

    // Always reset to page 1 on search change
    params.set("page", "1");

    startTransition(() => {
      router.push(`/students?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-6">
      <FilterWrapper
        title="Quick Filters"
        actions={
          <div className="flex flex-col md:flex-row gap-4 w-full items-center">
            <div className="relative flex-grow w-full md:w-auto">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                value={filters.query}
                onChange={(e) =>
                  setFilters({ ...filters, query: e.target.value })
                }
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-9 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                placeholder="Search by keywords..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={handleSearch}
                disabled={isPending}
                className="flex-1 md:flex-none px-4 py-2 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white font-medium rounded-lg shadow-sm hover:bg-gray-800 dark:hover:bg-white transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 text-sm whitespace-nowrap cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                Search
              </button>
              <button
                onClick={handleFilter}
                disabled={isPending}
                className="flex-1 md:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm whitespace-nowrap cursor-pointer"
              >
                <FilterIcon className="w-3.5 h-3.5" />
                Apply Filters
              </button>
            </div>
          </div>
        }
      >
        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Faculty Select */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Faculty
            </label>
            <select
              value={filters.faculty}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  faculty: e.target.value,
                  department: "",
                })
              }
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            >
              <option value="">All Faculties</option>
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department Select - Dynamically populated */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Department
            </label>
            <select
              value={filters.department}
              disabled={!filters.faculty || isLoadingDepts}
              onChange={(e) =>
                setFilters({ ...filters, department: e.target.value })
              }
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow disabled:opacity-50"
            >
              <option value="">
                {isLoadingDepts ? "Loading..." : "All Departments"}
              </option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Level Select */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Level
            </label>
            <select
              value={filters.level}
              onChange={(e) =>
                setFilters({ ...filters, level: e.target.value })
              }
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            >
              <option value="">All Levels</option>
              {[1, 2, 3, 4].map((l) => (
                <option key={l} value={l}>
                  Level {l}
                </option>
              ))}
            </select>
          </div>

          {/* Academic Year Select */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Academic Year
            </label>
            <select
              value={filters.academicYear}
              onChange={(e) =>
                setFilters({ ...filters, academicYear: e.target.value })
              }
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            >
              <option value="">All Years</option>
              {academicYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FilterWrapper>
    </div>
  );
}
