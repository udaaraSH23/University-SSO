"use client";
import { DashboardHeader, SlideOver } from "@repo/ui";
import {
  StudentGradesTable,
  StudentGrade,
} from "@/components/offerings/StudentGradesTable";
import { GradeForm, GradeFormData } from "@/components/forms/GradeForm";
import { Plus, Users, Calendar } from "lucide-react";
import { useState, use, useEffect, useCallback } from "react";
import {
  getCourseOfferingByIdAction,
  enrollStudentAction,
  deleteEnrollmentAction,
} from "@/actions/offering.actions";

export default function OfferingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [offering, setOffering] = useState<any>(null); // TODO: Type this properly from backend DTO if available
  const [loading, setLoading] = useState(true);

  const [isGradeSlideOpen, setIsGradeSlideOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeFormData | undefined>(
    undefined
  );

  const fetchOffering = useCallback(async () => {
    setLoading(true);
    const result = await getCourseOfferingByIdAction(Number(resolvedParams.id));
    if (result.success) {
      setOffering(result.data);
    } else {
      alert("Failed to fetch offering details");
    }
    setLoading(false);
  }, [resolvedParams.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOffering();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchOffering]);

  const handleAddGrade = () => {
    setEditingGrade(undefined);
    setIsGradeSlideOpen(true);
  };

  const handleSubmitGrade = async (data: GradeFormData) => {
    const result = await enrollStudentAction({
      offeringId: Number(resolvedParams.id),
      studentId: data.studentId,
      grade: data.grade,
    });

    if (result.success) {
      alert("Student enrolled/graded successfully!");
      setIsGradeSlideOpen(false);
      fetchOffering(); // Refresh data
    } else {
      alert(result.error || "Failed to save record");
    }
  };

  const handleDeleteGrade = async (grade: StudentGrade) => {
    if (
      confirm(
        `Are you sure you want to remove ${grade.studentName} from this course?`
      )
    ) {
      setLoading(true);
      // We need the enrollment ID, which is mapped to grade.id in tableData
      const result = await deleteEnrollmentAction(Number(grade.id));
      if (result.success) {
        alert("Record deleted successfully");
        fetchOffering();
      } else {
        alert(result.error || "Failed to delete record");
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!offering) {
    return <div className="p-6">Offering not found</div>;
  }

  // Convert enrollments to table format
  const tableData: StudentGrade[] = offering.enrollments.map((e: any) => ({
    id: e.id.toString(),
    studentId: e.studentId,
    studentName: e.studentName,
    grade: e.grade as "A" | "B" | "C" | "S" | "F",
    marks: 0, // Not used in display anymore, keeping for type sanity if needed or remove from table component later
  }));

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title={offering.courseName}
        description={`${offering.courseCode} | ${offering.semester} ${offering.academicYear}`}
        breadcrumb={[
          { label: "Grades & Offerings", href: "/grades-offerings" },
          {
            label: offering.courseCode,
            href: `/grades-offerings/${offering.id}`,
          },
        ]}
      >
        {/* Removed Edit Button for now as per minimal requirement focus on viewing/enrolling */}
      </DashboardHeader>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enrollment
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {offering.enrolledCount} Students
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Term</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Sem {offering.semester} - {offering.academicYear} (Level{" "}
              {offering.level})
            </p>
          </div>
        </div>
      </div>

      {/* Grades Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Enrolled Students & Grades
          </h2>
          <button
            onClick={handleAddGrade}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add New Record
          </button>
        </div>

        <StudentGradesTable
          data={tableData}
          onEdit={(grade) => {
            setEditingGrade({
              studentId: grade.studentId,
              grade: grade.grade,
            });
            setIsGradeSlideOpen(true);
          }}
          onDelete={handleDeleteGrade}
        />
      </div>

      <SlideOver
        isOpen={isGradeSlideOpen}
        onClose={() => setIsGradeSlideOpen(false)}
        title="Add Student Record"
        description="Enroll a student and assign a grade."
      >
        <GradeForm
          initialData={editingGrade}
          onSubmit={handleSubmitGrade}
          onCancel={() => setIsGradeSlideOpen(false)}
        />
      </SlideOver>
    </div>
  );
}
