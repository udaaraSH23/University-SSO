"use client";

import { CourseForm, CourseFormData } from "@/components/forms/CourseForm";
import {
  DashboardHeader,
  FilterWrapper,
  SlideOver,
  useDeleteConfirmation,
} from "@repo/ui";
import { CoursesTable, Course } from "@/components/courses/CoursesTable";
import { Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  getCoursesAction,
  createCourseAction,
  updateCourseAction,
  deleteCourseAction,
  getDepartmentsAction,
} from "@/actions/academics.actions";

export default function CoursesPage() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = Number(searchParams.get("page")) || 1;
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<
    CourseFormData | undefined
  >(undefined);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState<any[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState<number | undefined>(
    undefined
  );
  const { confirmDelete } = useDeleteConfirmation();

  const fetchCourses = async () => {
    setLoading(true);
    const result = await getCoursesAction(departmentFilter, currentPage);
    if (result.success && result.data) {
      setCourses(result.data as Course[]);
      setTotalPages(Math.ceil((result.total || 0) / 10));
    } else {
      console.error("Failed to fetch courses");
    }
    setLoading(false);
  };

  useEffect(() => {
    async function fetchDepartments() {
      const res = await getDepartmentsAction();
      if (res.success && res.data) {
        setDepartments(res.data);
      }
    }
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [currentPage, departmentFilter]);

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

  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="relative">
            <input
              className="w-full pl-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none text-sm"
              placeholder="Search by course name or code..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        }
        onSearch={() => fetchCourses()}
        onClear={() => {
          setSearchTerm("");
          setDepartmentFilter(undefined);
        }}
      >
        <div className="flex items-center gap-2">
          <select
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none text-sm"
            value={departmentFilter || ""}
            onChange={(e) =>
              setDepartmentFilter(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
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
