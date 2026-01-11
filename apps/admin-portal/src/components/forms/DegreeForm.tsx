"use client";

import { useState, useEffect } from "react";
import { getDepartmentsAction } from "@/actions/academics.actions";
import { DepartmentDTO } from "@repo/backend";

export interface DegreeFormData {
  name: string;
  departmentId: number;
  intakeAcademicYear: string;
}

interface DegreeFormProps {
  initialData?: DegreeFormData;
  onSubmit: (data: DegreeFormData) => void;
  onCancel: () => void;
}

export function DegreeForm({
  initialData,
  onSubmit,
  onCancel,
}: DegreeFormProps) {
  const [formData, setFormData] = useState<DegreeFormData>(
    initialData || {
      name: "",
      departmentId: 0,
      intakeAcademicYear: "",
    }
  );

  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);

  /* Initial data handling is now in useState initialization
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        departmentId: 0,
        intakeAcademicYear: "",
      });
    }
  }, [initialData]);
  */

  useEffect(() => {
    getDepartmentsAction().then((res) => {
      if (res.success && res.data) setDepartments(res.data);
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "departmentId" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Degree Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
        />
      </div>

      <div>
        <label
          htmlFor="departmentId"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Department
        </label>
        <select
          name="departmentId"
          id="departmentId"
          required
          value={formData.departmentId || ""}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="intakeAcademicYear"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Intake Academic Year
        </label>
        <input
          type="text"
          name="intakeAcademicYear"
          id="intakeAcademicYear"
          required
          placeholder="e.g. 2024-2025"
          value={formData.intakeAcademicYear}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Degree
        </button>
      </div>
    </form>
  );
}
