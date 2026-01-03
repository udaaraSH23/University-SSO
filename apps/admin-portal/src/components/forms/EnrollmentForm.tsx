"use client";

// Author: UDARA SHANUKA
// Project: University-Portal
// FP-ID: FP-20260101-ADMIN-FORM-ENROLLMENT
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-01T12:00:00+05:30

const __FP_SIG = "FP-20260101-ADMIN-FORM-ENROLLMENT|HASH-PLACEHOLDER";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { getCourseOfferingsAction } from "@/actions/offering.actions";

/**
 * EnrollmentForm
 *
 * Purpose:
 * - A form component to enroll a student in a course and assign a grade.
 * - Supports searching for course offerings and selecting a grade.
 *
 * Responsibilities:
 * - Validating form input using Zod.
 * - fetching course offerings based on search input.
 * - Submitting enrollment data to the parent handler.
 */

const enrollmentSchema = z.object({
  offeringId: z.coerce.number().min(1, "Please select a course"),
  grade: z.string().min(1, "Please select a grade"),
});

export type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

interface EnrollmentFormProps {
  onSubmit: (data: EnrollmentFormData) => Promise<void>;
  onCancel: () => void;
  degreeProgramId: number;
  initialData?: {
    offeringId: number;
    courseName?: string;
    courseCode?: string;
    grade?: string;
  };
  isEdit?: boolean;
}

export function EnrollmentForm({
  onSubmit,
  onCancel,
  degreeProgramId,
  initialData,
  isEdit = false,
}: EnrollmentFormProps) {
  const [isPending, startTransition] = useTransition();
  const [offerings, setOfferings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema) as any,
    defaultValues: {
      grade: initialData?.grade || "A",
      offeringId: initialData?.offeringId,
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        grade: initialData.grade || "A",
        offeringId: initialData.offeringId,
      });
    } else {
      reset({
        grade: "A",
        offeringId: undefined,
      });
    }
  }, [initialData, reset]);

  const selectedOfferingId = watch("offeringId");

  // Debounced search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setSearching(true);
      try {
        // Fetch offerings based on search or default recent
        const result = await getCourseOfferingsAction({
          search: searchTerm,
          limit: 10,
          degreeProgramId,
        });
        if (result.success && "data" in result) {
          setOfferings(result.data || []);
        }
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, degreeProgramId]);

  const handleFormSubmit = (data: EnrollmentFormData) => {
    startTransition(async () => {
      await onSubmit(data);
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Course Search Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Search Course Offering
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by course name or code..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isEdit}
          />
        </div>
      </div>

      {/* Course Selection List */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Course
        </label>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg max-h-60 overflow-y-auto bg-white dark:bg-gray-800">
          {searching ? (
            <div className="p-4 text-center text-gray-500 flex justify-center items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading courses...
            </div>
          ) : offerings.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {offerings.map((offering) => (
                <div
                  key={offering.id}
                  onClick={() => setValue("offeringId", offering.id)}
                  className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex flex-col ${
                    selectedOfferingId === offering.id
                      ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                      : "border-l-4 border-transparent"
                  }`}
                >
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {offering.courseName} ({offering.courseCode})
                  </span>
                  <span className="text-xs text-gray-500">
                    Full Year • {offering.academicYear} • Sem{" "}
                    {offering.semester}
                  </span>
                </div>
              ))}
            </div>
          ) : isEdit && initialData ? (
            <div className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {initialData.courseName} ({initialData.courseCode})
              </span>
              <span className="block text-xs text-gray-500">Editing Grade</span>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No courses found. Try searching.
            </div>
          )}
        </div>
        {errors.offeringId && (
          <p className="text-sm text-red-500">{errors.offeringId.message}</p>
        )}
      </div>

      {/* Grade Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Grade
        </label>
        <select
          {...register("grade")}
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        >
          {["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"].map(
            (g) => (
              <option key={g} value={g}>
                {g}
              </option>
            )
          )}
        </select>
        {errors.grade && (
          <p className="text-sm text-red-500">{errors.grade.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending || (!selectedOfferingId && !isEdit)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? "Saving..." : isEdit ? "Update Grade" : "Enroll Student"}
        </button>
      </div>
    </form>
  );
}
