"use client";

import { CourseForm, CourseFormData } from "@/components/forms/CourseForm";
import { DashboardHeader, SlideOver, useDeleteConfirmation } from "@repo/ui";
import { FilterWrapper } from "@/components/shared/FilterWrapper";
import { CoursesTable, Course } from "@/components/courses/CoursesTable";
import { Plus, Search, Filter as FilterIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  getCoursesAction,
  createCourseAction,
  updateCourseAction,
  deleteCourseAction,
} from "@/actions/academics.actions";

interface CoursesClientProps {
  initialCourses: any; // Using any to match action return type structure
  faculties: any[];
  degrees: any[];
}

export function CoursesClient({
  initialCourses,
  faculties,
  degrees,
}: CoursesClientProps) {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>(initialCourses?.data || []);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(
    Math.ceil((initialCourses?.total || 0) / 10)
  );
  const currentPage = Number(searchParams.get("page")) || 1;
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<
    CourseFormData | undefined
  >(undefined);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);

  const [facultyFilter, setFacultyFilter] = useState<number | undefined>(
    undefined
  );
  const [degreeFilter, setDegreeFilter] = useState<number | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState("");
  // We can still keep department filter if needed, but per request we focus on Faculty and Degree
  // We will map Degree -> DepartmentId for the query
  const { confirmDelete } = useDeleteConfirmation();

  const fetchCourses = async () => {
    setLoading(true);
    // Logic: If degree selected, use its departmentId.
    // If faculty selected, use facultyId.
    let targetDeptId: number | undefined = undefined;

    if (degreeFilter) {
      const selectedDegree = degrees.find((d) => d.id === degreeFilter);
      if (selectedDegree) {
        targetDeptId = selectedDegree.departmentId;
      }
    }

    const result = await getCoursesAction(
      targetDeptId,
      currentPage,
      searchTerm,
      facultyFilter
    );
    if (result.success && result.data) {
      setCourses(result.data as Course[]);
      setTotalPages(Math.ceil((result.total || 0) / 10)); // Default limit 10
    } else {
      console.error("Failed to fetch courses");
    }
    setLoading(false);
  };

  useEffect(() => {
    // Initial fetch handled by Server Component, but update on page change
    fetchCourses();
  }, [currentPage]);

  // Note: similar to other pages, filtering is triggered by the "Search" / "Filter" buttons manually calling fetchCourses()
  // except for currentPage which triggers it automatically here.

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "add") {
      setEditingCourse(undefined);
      setEditingCourseId(null);
      setIsSlideOverOpen(true);
    }
  }, [searchParams]);

  const handleOpenAdd = () => {
    setEditingCourse(undefined);
    setEditingCourseId(null);
    setIsSlideOverOpen(true);
  };

  const handleClose = () => {
    setIsSlideOverOpen(false);
    setEditingCourse(undefined);
    setEditingCourseId(null);
  };

  const handleSubmit = async (data: CourseFormData) => {
    let result;
    if (editingCourseId) {
      result = await updateCourseAction(editingCourseId, {
        name: data.name,
        code: data.code,
        departmentId: data.departmentId,
        credits: data.credits,
        description: data.description,
      });
    } else {
      result = await createCourseAction({
        name: data.name,
        code: data.code,
        departmentId: data.departmentId,
        credits: data.credits,
        description: data.description,
      });
    }

    if (result.success) {
      toast.success(
        editingCourseId
          ? "Course updated successfully"
          : "Course created successfully"
      );
      handleClose();
      fetchCourses();
    } else {
      toast.error(
        editingCourseId ? "Failed to update course" : "Failed to create course"
      );
    }
  };

  const handleDeleteClick = (course: Course) => {
    confirmDelete({
      title: "Delete Course",
      description: `Are you sure you want to delete "${course.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        const result = await deleteCourseAction(course.id);
        if (result.success) {
          toast.success("Course deleted successfully");
          fetchCourses();
        } else {
          toast.error("Failed to delete course");
        }
      },
    });
  };

  // Client-side filtering removed in favor of server-side
  const filteredCourses = courses;

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Courses"
        description="Manage course offerings and modules."
        breadcrumb={[
          { label: "Academics", href: "/academics" },
          { label: "Courses", href: "/academics/courses" },
        ]}
      >
        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </DashboardHeader>

      <FilterWrapper
        title="Courses"
        resourceCount={filteredCourses.length}
        searchNode={
          <div className="relative w-full">
            <input
              className="w-full pl-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none text-sm"
              placeholder="Search by course name or code..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        }
        actions={
          <>
            <button
              onClick={() => fetchCourses()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
            <button
              onClick={() => {
                fetchCourses();
              }}
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
          value={degreeFilter || ""}
          onChange={(e) =>
            setDegreeFilter(e.target.value ? Number(e.target.value) : undefined)
          }
        >
          <option value="">All Degrees</option>
          {degrees.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </FilterWrapper>

      {loading ? (
        <div className="p-12 text-center text-gray-500">Loading courses...</div>
      ) : (
        <CoursesTable
          data={filteredCourses}
          onEdit={(course) => {
            setEditingCourse({
              name: course.name,
              code: course.code,
              departmentId: course.departmentId,
              credits: course.credits,
              description: course.description,
            });
            setEditingCourseId(course.id);
            setIsSlideOverOpen(true);
          }}
          onDelete={handleDeleteClick}
          pagination={{
            currentPage,
            totalPages,
            basePath: "/academics/courses",
          }}
        />
      )}

      <SlideOver
        isOpen={isSlideOverOpen}
        onClose={handleClose}
        title={editingCourse ? "Edit Course" : "Add New Course"}
        description={
          editingCourse
            ? "Modify the details of the existing course module."
            : "Add a new course module to a degree program."
        }
      >
        <CourseForm
          initialData={editingCourse}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </SlideOver>
    </div>
  );
}
