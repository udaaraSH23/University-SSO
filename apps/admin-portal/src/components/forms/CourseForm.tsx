"use client";

import { useState, useEffect } from "react";
import { getDepartmentsAction } from "@/actions/academics.actions";

export interface CourseFormData {
  name: string;
  code: string;
  departmentId: number;
  credits: number;
  description?: string;
}

interface CourseFormProps {
  initialData?: CourseFormData;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
}

export function CourseForm({
  initialData,
  onSubmit,
  onCancel,
}: CourseFormProps) {
  const [formData, setFormData] = useState<CourseFormData>(
    initialData || {
      name: "",
      code: "",
      departmentId: 0,
      credits: 3,
      description: "",
    }
  );

  const [departments, setDepartments] = useState<any[]>([]);

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
      [name]:
        name === "credits" || name === "departmentId" ? Number(value) : value,
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
          Course Name
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
          htmlFor="code"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Course Code
        </label>
        <input
          type="text"
          name="code"
          id="code"
          required
          value={formData.code}
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
          {departments.map((d: any) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="credits"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Credits
        </label>
        <input
          type="number"
          name="credits"
          id="credits"
          required
          min={1}
          max={10}
          value={formData.credits}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          value={formData.description}
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
          Save Course
        </button>
      </div>
    </form>
  );
}
