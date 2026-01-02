"use client";

import { DashboardHeader, SlideOver, Modal } from "@repo/ui";
import { CoursesTable, Course } from "@/components/courses/CoursesTable";
import { CourseForm, CourseFormData } from "@/components/forms/CourseForm";
import { DegreeForm, DegreeFormData } from "@/components/forms/DegreeForm";
import { useState, useEffect, use } from "react";
import { Plus, Edit } from "lucide-react";

import {
  getDegreeProgramByIdAction,
  getCoursesAction,
  createCourseAction,
  updateDegreeProgramAction,
  deleteCourseAction,
} from "@/actions/academics.actions";
import { toast } from "sonner";

export default function DegreeDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const resolvedParams = use(params);

  const [degree, setDegree] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCourseSlideOverOpen, setIsCourseSlideOverOpen] = useState(false);
  const [isEditDegreeOpen, setIsEditDegreeOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<
    Course | undefined
  >(undefined);

  const fetchData = async () => {
    setLoading(true);
    const degreeId = Number.parseInt(resolvedParams.id);
    const degreeRes = await getDegreeProgramByIdAction(degreeId);

    if (degreeRes.success && degreeRes.data) {
      setDegree(degreeRes.data);
      // Since no direct link, we fetch courses for the department of this degree
      // This assumes "Courses" on this page means "Courses available to this degree's department"
      const coursesRes = await getCoursesAction(degreeRes.data.departmentId);
      if (coursesRes.success) {
        setCourses(coursesRes.data as Course[]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [resolvedParams.id]);

  const handleAddCourse = () => {
    setIsCourseSlideOverOpen(true);
  };

  const handleEditDegree = () => {
    setIsEditDegreeOpen(true);
  };

  const handleCreateCourse = async (data: CourseFormData) => {
    if (!degree) return;
    const result = await createCourseAction({
      name: data.name,
      code: data.code,
      departmentId: degree.departmentId,
      credits: data.credits,
      description: data.description,
    });

    if (result.success) {
      toast.success("Course created successfully");
      setIsCourseSlideOverOpen(false);
      fetchData();
    } else {
      toast.error("Failed to create course");
    }
  };

  const handleUpdateDegree = async (data: DegreeFormData) => {
    const result = await updateDegreeProgramAction(
      Number.parseInt(resolvedParams.id),
      {
        name: data.name,
        departmentId: data.departmentId,
        intakeAcademicYear: data.intakeAcademicYear,
      }
    );

    if (result.success) {
      toast.success("Degree program updated successfully");
      setIsEditDegreeOpen(false);
      fetchData();
    } else {
      toast.error("Failed to update degree program");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmation) return;

    const result = await deleteCourseAction(deleteConfirmation.id);
    if (result.success) {
      toast.success("Course deleted successfully");
      fetchData();
      setDeleteConfirmation(undefined);
    } else {
      toast.error("Failed to delete course");
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500">
        Loading degree details...
      </div>
    );
  }

  if (!degree) {
    return (
      <div className="p-12 text-center text-gray-500">
        Degree Program not found
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title={degree.name}
        description={`Department: ${degree.departmentName} | Intake: ${degree.intakeAcademicYear}`}
        breadcrumb={[
          { label: "Academics", href: "/academics" },
          { label: "Degrees", href: "/academics/degrees" },
          {
            label: degree.name,
            href: `/academics/degrees/${resolvedParams.id}`,
          },
        ]}
      >
        <button
          onClick={handleEditDegree}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
        >
          <Edit className="w-4 h-4" />
          Edit Degree
        </button>
      </DashboardHeader>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          About the Degree
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100 dark:border-gray-700">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Department
            </p>
            <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
              {degree.departmentName}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Intake Year
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {degree.intakeAcademicYear}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Available Courses (Department)
          </h2>
          <button
            onClick={handleAddCourse}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Course
          </button>
        </div>

        <CoursesTable
          data={courses}
          onEdit={(course) => console.log("Edit course", course)}
          onDelete={(course) => setDeleteConfirmation(course)}
        />
      </div>

      <SlideOver
        isOpen={isCourseSlideOverOpen}
        onClose={() => setIsCourseSlideOverOpen(false)}
        title="Add New Course"
        description={`Add a new course to ${degree.departmentName}.`}
      >
        <CourseForm
          initialData={{
            name: "",
            code: "",
            departmentId: degree.departmentId,
            credits: 3,
            description: "",
          }}
          onSubmit={handleCreateCourse}
          onCancel={() => setIsCourseSlideOverOpen(false)}
        />
      </SlideOver>

      <SlideOver
        isOpen={isEditDegreeOpen}
        onClose={() => setIsEditDegreeOpen(false)}
        title="Edit Degree Program"
        description="Modify degree details."
      >
        <DegreeForm
          initialData={{
            name: degree.name,
            departmentId: degree.departmentId,
            intakeAcademicYear: degree.intakeAcademicYear,
          }}
          onSubmit={handleUpdateDegree}
          onCancel={() => setIsEditDegreeOpen(false)}
        />
      </SlideOver>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(undefined)}
        title="Delete Course"
        description={`Are you sure you want to delete "${deleteConfirmation?.name}"?`}
        variant="danger"
        footer={
          <>
            <button
              onClick={() => setDeleteConfirmation(undefined)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </>
        }
      >
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <p>
            This action cannot be undone. All offerings and enrollments
            associated with this course will be deleted.
          </p>
        </div>
      </Modal>
    </div>
  );
}
