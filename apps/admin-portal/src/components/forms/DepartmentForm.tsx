import { useState, useEffect } from "react";
import { getFacultiesAction } from "@/actions/academics.actions";

export interface DepartmentFormData {
  name: string;
  facultyId: number;
}

interface DepartmentFormProps {
  initialData?: DepartmentFormData;
  onSubmit: (data: DepartmentFormData) => void;
  onCancel: () => void;
}

export function DepartmentForm({
  initialData,
  onSubmit,
  onCancel,
}: DepartmentFormProps) {
  const [formData, setFormData] = useState<DepartmentFormData>(
    initialData || {
      name: "",
      facultyId: 0,
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        facultyId: 0,
      });
    }
  }, [initialData]);

  const [faculties, setFaculties] = useState<any[]>([]);

  useEffect(() => {
    getFacultiesAction().then((res) => {
      if (res.success && res.data) setFaculties(res.data);
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "facultyId" ? Number(value) : value,
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
          Department Name
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
          htmlFor="facultyId"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Faculty
        </label>
        <select
          name="facultyId"
          id="facultyId"
          required
          value={formData.facultyId || ""}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
        >
          <option value="">Select Faculty</option>
          {faculties.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
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
          Save Department
        </button>
      </div>
    </form>
  );
}
