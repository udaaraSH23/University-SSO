"use client";

import { useState, useMemo } from "react";
import { AcademicCourseDTO } from "@repo/backend";
import { searchCoursesAction } from "@/actions/offering.actions";
import { Search } from "lucide-react";
import debounce from "lodash.debounce";

export interface OfferingFormData {
  course: string; // ID
  semester: number;
  academicYear: string;
  level: number;
}

interface OfferingFormProps {
  initialData?: OfferingFormData;
  onSubmit: (data: OfferingFormData) => void;
  onCancel: () => void;
}

export function OfferingForm({
  initialData,
  onSubmit,
  onCancel,
}: OfferingFormProps) {
  const [formData, setFormData] = useState<OfferingFormData>(
    initialData || {
      course: "",
      semester: 1, // Default to 1
      academicYear: "",
      level: 1, // Default to 1
    }
  );

  const [courseSearch, setCourseSearch] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<AcademicCourseDTO[]>([]);
  const [selectedcourseName, setSelectedCourseName] = useState("");

  const searchCourses = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const response = await searchCoursesAction(query);
    if (response.success && response.data) {
      setSearchResults(response.data);
    }
    setIsSearching(false);
  };

  const debouncedSearch = useMemo(
    () => debounce((query: string) => searchCourses(query), 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setCourseSearch(query);
    debouncedSearch(query);
  };

  const selectCourse = (course: AcademicCourseDTO) => {
    setFormData((prev) => ({ ...prev, course: course.id.toString() }));
    setSelectedCourseName(`${course.code} - ${course.name}`);
    setCourseSearch("");
    setSearchResults([]);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "semester" || name === "level" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Course
        </label>
        {selectedcourseName ? (
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {selectedcourseName}
            </span>
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({ ...prev, course: "" }));
                setSelectedCourseName("");
              }}
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
            >
              Change
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              value={courseSearch}
              onChange={handleSearchChange}
              placeholder="Search by name or code..."
              className="w-full pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => selectCourse(course)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {course.code}
                    </div>
                    <div className="text-gray-500 text-xs">{course.name}</div>
                  </button>
                ))}
              </div>
            )}
            <input
              type="hidden"
              name="course"
              value={formData.course}
              required
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Semester
          </label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            required
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          >
            <option value="">Select Semester</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Level
          </label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            required
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          >
            <option value="">Select Level</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Academic Year
          </label>
          <input
            type="text"
            name="academicYear"
            value={formData.academicYear}
            onChange={handleChange}
            placeholder="e.g. 2024/2025"
            required
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          />
        </div>
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
          disabled={!formData.course}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Offering
        </button>
      </div>
    </form>
  );
}
