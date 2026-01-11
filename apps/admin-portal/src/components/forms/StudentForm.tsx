"use client";

import { useState, useEffect } from "react";
import { getDegreeProgramsAction } from "@/actions/academics.actions";
import { StudentCreateDTO, DegreeProgramDTO } from "@repo/backend";
import { toast } from "sonner";

interface StudentFormProps {
  initialData?: Partial<StudentCreateDTO> & { id?: number };
  onSubmit: (data: StudentCreateDTO) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export function StudentForm({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}: StudentFormProps) {
  const [degreePrograms, setDegreePrograms] = useState<DegreeProgramDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: initialData?.username || "",
    email: initialData?.email || "",
    fullName: initialData?.fullName || "",
    studentId: initialData?.studentId || "",
    degreeProgramId: initialData?.degreeProgramId || "",
    currentAcademicYear: initialData?.currentAcademicYear || "2024/2025",
    level: initialData?.level || 1,
  });

  useEffect(() => {
    async function fetchDegrees() {
      const result = await getDegreeProgramsAction();
      if (result.success && result.data) {
        setDegreePrograms(result.data);
      }
    }
    fetchDegrees();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "level" || name === "degreeProgramId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData as unknown as StudentCreateDTO);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          Account Information
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={isEdit}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isEdit}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          Student Profile
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Student ID
          </label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
            disabled={isEdit}
            placeholder="STU001"
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Degree Program
        </label>
        <select
          name="degreeProgramId"
          value={formData.degreeProgramId}
          onChange={handleChange}
          required
          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Degree Program</option>
          {degreePrograms.map((dp) => (
            <option key={dp.id} value={dp.id}>
              {dp.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Academic Year
          </label>
          <input
            type="text"
            name="currentAcademicYear"
            value={formData.currentAcademicYear}
            onChange={handleChange}
            required
            placeholder="2024/2025"
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
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
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? "Saving..." : isEdit ? "Update Student" : "Create Student"}
        </button>
      </div>
    </form>
  );
}
