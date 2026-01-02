"use client";

import { useState, useEffect } from "react";
import { Search, Check } from "lucide-react";
import { searchStudentsAction } from "@/actions/offering.actions";

export interface GradeFormData {
  studentId: string;
  grade: string;
}

interface GradeFormProps {
  initialData?: GradeFormData;
  onSubmit: (data: GradeFormData) => void;
  onCancel: () => void;
}

export function GradeForm({ initialData, onSubmit, onCancel }: GradeFormProps) {
  const [formData, setFormData] = useState<GradeFormData>(
    initialData || {
      studentId: "",
      grade: "A",
    }
  );

  const [studentSearch, setStudentSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (studentSearch.length > 2 && !initialData) {
        // Only search if not editing (or allow editing but careful)
        setIsSearching(true);
        const res = await searchStudentsAction(studentSearch);
        if (res.success) {
          setSearchResults(res.data || []);
          setShowResults(true);
        }
        setIsSearching(false);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [studentSearch, initialData]);

  // If initial data has studentId, we might want to display it properly,
  // but for now let's just assume if it's there, it's set.
  useEffect(() => {
    if (initialData?.studentId) {
      setStudentSearch(initialData.studentId);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectStudent = (student: any) => {
    setFormData((prev) => ({ ...prev, studentId: student.studentId }));
    setStudentSearch(`${student.name} (${student.studentId})`);
    setShowResults(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Student
        </label>
        <div className="relative">
          <input
            type="text"
            value={studentSearch}
            onChange={(e) => {
              setStudentSearch(e.target.value);
              // If user types, clear the selected ID until they select again, unless they are just refining?
              // For simplicity, let's force selection for ID.
              if (!initialData)
                setFormData((prev) => ({ ...prev, studentId: "" }));
            }}
            disabled={!!initialData?.studentId} // Disable search if editing existing
            placeholder="Search by Name or ID..."
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg pl-10 pr-3 py-2.5 disabled:opacity-50 outline-none transition-shadow focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        </div>

        {/* Search Results Dropdown */}
        {showResults && !initialData && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((student) => (
              <button
                key={student.id}
                type="button"
                onClick={() => selectStudent(student)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex flex-col"
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {student.name}
                </span>
                <span className="text-xs text-gray-500">
                  {student.studentId}
                </span>
              </button>
            ))}
          </div>
        )}
        {formData.studentId && !initialData && (
          <div className="mt-1 text-xs text-green-600 flex items-center gap-1">
            <Check className="w-3 h-3" /> Selected: {formData.studentId}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Grade
        </label>
        <select
          name="grade"
          value={formData.grade}
          onChange={handleChange}
          required
          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 outline-none transition-shadow focus:ring-2 focus:ring-blue-500"
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="S">S</option>
          <option value="F">F</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!formData.studentId}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Grade
        </button>
      </div>
    </form>
  );
}
