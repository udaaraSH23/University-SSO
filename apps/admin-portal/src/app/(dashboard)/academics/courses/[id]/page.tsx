"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader, SlideOver, useDeleteConfirmation } from "@repo/ui";
import { CourseForm, CourseFormData } from "@/components/forms/CourseForm";
import {
  getCourseByIdAction,
  updateCourseAction,
  deleteCourseAction,
} from "@/actions/academics.actions";
import { Edit2, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { confirmDelete } = useDeleteConfirmation();

  const fetchCourse = useCallback(async () => {
    setLoading(true);
    const courseId = Number.parseInt(resolvedParams.id);
    const result = await getCourseByIdAction(courseId);

    if (result.success && result.data) {
      setCourse(result.data);
    } else {
      console.error("Failed to fetch course");
    }
    setLoading(false);
  }, [resolvedParams.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourse();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchCourse]);

  const handleUpdateCourse = async (data: CourseFormData) => {
    const courseId = Number.parseInt(resolvedParams.id);
    const result = await updateCourseAction(courseId, {
      name: data.name,
      code: data.code,
      departmentId: data.departmentId,
      credits: data.credits,
      description: data.description,
    });

    if (result.success) {
      setIsEditOpen(false);
      fetchCourse();
    } else {
      alert("Failed to update course");
    }
  };

  const handleDelete = async () => {
    confirmDelete({
      title: "Delete Course",
      description:
        "Are you sure you want to delete this course? This action cannot be undone.",
      onConfirm: async () => {
        const courseId = Number.parseInt(resolvedParams.id);
        const result = await deleteCourseAction(courseId);
        if (result.success) {
          router.push("/academics/courses");
        } else {
          alert("Failed to delete course");
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading course details...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-gray-500">
        <p>Course not found</p>
        <Link
          href="/academics/courses"
          className="text-blue-600 hover:underline"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader
        title={course.name}
        description={`${course.code} • ${course.credits} Credits • ${course.departmentName}`}
        breadcrumb={[
          { label: "Academics", href: "/academics" },
          { label: "Courses", href: "/academics/courses" },
          {
            label: course.code,
            href: `/academics/courses/${resolvedParams.id}`,
          },
        ]}
      >
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditOpen(true)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            title="Edit Course"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            title="Delete Course"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </DashboardHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                About this Course
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {course.description ||
                "No description available for this course."}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Course Details
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Code
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                  {course.code}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Credits
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {course.credits}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Department
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {course.departmentName}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="space-y-6">
          {/* Placeholder for future sidebar items like "Enrolled Students" or "Instructors" */}
        </div>
      </div>

      <SlideOver
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Course"
        description="Update the details of this course."
      >
        <CourseForm
          initialData={
            course
              ? {
                  name: course.name,
                  code: course.code,
                  departmentId: course.departmentId,
                  credits: course.credits,
                  description: course.description,
                }
              : undefined
          }
          onSubmit={handleUpdateCourse}
          onCancel={() => setIsEditOpen(false)}
        />
      </SlideOver>
    </>
  );
}
