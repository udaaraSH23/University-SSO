"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader, SlideOver } from "@repo/ui";
import { CourseForm, CourseFormData } from "@/components/forms/CourseForm";
import {
  getCourseByIdAction,
  updateCourseAction,
  deleteCourseAction,
} from "@/actions/academics.actions";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
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

  const fetchCourse = async () => {
    setLoading(true);
    const courseId = Number.parseInt(resolvedParams.id);
    const result = await getCourseByIdAction(courseId);

    if (result.success && result.data) {
      setCourse(result.data);
    } else {
      console.error("Failed to fetch course");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourse();
  }, [resolvedParams.id]);

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
    if (confirm("Are you sure you want to delete this course?")) {
      const courseId = Number.parseInt(resolvedParams.id);
      const result = await deleteCourseAction(courseId);
      if (result.success) {
        router.push("/academics/courses");
      } else {
        alert("Failed to delete course");
      }
    }
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link
          href="/academics/courses"
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {course.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {course.code} • {course.credits} Credits • {course.departmentName}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              About this Course
            </h2>
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
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30">
            <h3 className="text-blue-800 dark:text-blue-300 font-medium mb-2">
              Quick Actions
            </h3>
            <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
              <li>
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="hover:underline"
                >
                  Edit Course Details
                </button>
              </li>
            </ul>
          </div>
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
    </div>
  );
}
