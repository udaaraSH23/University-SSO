"use client";

import { StudentLibraryProfile } from "@repo/backend";
import { Users, CheckCircle, Edit, Trash2, BookOpen } from "lucide-react";

interface StudentDetailsProps {
  student: StudentLibraryProfile;
  onToggleRegistration: (studentId: string) => Promise<{ success: boolean }>;
}

/**
 * Displays detailed information about a selected student.
 * Provides controls to toggle library registration and view current loans.
 *
 * @param {object} props - Component props
 * @param {StudentLibraryProfile} props.student - The student's profile data
 * @param {Function} props.onToggleRegistration - Server action to register/deregister student
 */
export default function StudentDetails({
  student,
  onToggleRegistration,
}: StudentDetailsProps) {
  const isRegistered = student.isRegistered;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-8">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <Users className="mr-2 text-indigo-600 dark:text-indigo-400 w-5 h-5" />
          Student Info
        </h3>
        <div className="flex items-center gap-3">
          {isRegistered ? (
            <div className="flex items-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-1" />
              Registered
            </div>
          ) : (
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-sm font-medium">
              Not Registered
            </div>
          )}
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Student No
            </label>
            <div className="text-lg font-medium text-gray-900 dark:text-white">
              {student.studentId}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Full Name
            </label>
            <div className="text-lg font-medium text-gray-900 dark:text-white">
              {student.fullName}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Degree Program
            </label>
            <div className="text-lg font-medium text-gray-900 dark:text-white">
              {student.degreeProgram}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Academic Year
            </label>
            <div className="text-lg font-medium text-gray-900 dark:text-white">
              {student.currentAcademicYear}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex gap-3 justify-end border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => onToggleRegistration(student.studentId)}
          className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center transition-colors ${
            isRegistered
              ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40"
              : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
          }`}
        >
          {isRegistered ? (
            <>
              <Trash2 className="w-4 h-4 mr-1" /> Remove from Library
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-1" /> Add to Library
            </>
          )}
        </button>
      </div>

      {/* Currently Borrowed Books - Only show if registered */}
      {isRegistered && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <BookOpen className="w-4 h-4 mr-2 text-indigo-500" />
            Currently Borrowed
          </h4>
          {student.currentLoans && student.currentLoans.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3">Book</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {student.currentLoans.map((loan) => (
                    <tr key={loan.id}>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {(loan as any).book?.title || "Unknown Book"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                        {new Date(loan.due_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                          Borrowed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No active loans.</p>
          )}
        </div>
      )}
    </div>
  );
}
