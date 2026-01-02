"use client";

// Author: UDARA SHANUKA
// Project: University-Portal
// FP-ID: FP-20260101-ADMIN-FACULTY-DETAIL-PAGE
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-01T12:13:27+05:30

const __FP_SIG = "FP-20260101-ADMIN-FACULTY-DETAIL-PAGE|HASH-PLACEHOLDER";

import { DashboardHeader, SlideOver, Modal } from "@repo/ui";
import {
  DepartmentsTable,
  Department,
} from "@/components/departments/DepartmentsTable";
import {
  DepartmentForm,
  DepartmentFormData,
} from "@/components/forms/DepartmentForm";
import { useState, useEffect, use } from "react";
import { Plus, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getFacultyByIdAction,
  getDepartmentsAction,
  createDepartmentAction,
  updateFacultyAction,
  deleteDepartmentAction,
  updateDepartmentAction,
} from "@/actions/academics.actions";
import { FacultyForm, FacultyFormData } from "@/components/forms/FacultyForm";
import { toast } from "sonner";

/**
 * FacultyDetailPage
 *
 * Purpose:
 * - Displays detailed information about a specific faculty.
 * - Manages the list of departments within the faculty.
 * - Provides functionality to add, edit, and delete departments.
 * - Allows editing of the faculty itself.
 *
 * Responsibilities:
 * - Fetching faculty details and associated departments.
 * - Managing state for "Edit Faculty" and "Add/Edit Department" forms.
 * - Handling text-based delete confirmation for departments.
 * - Interacting with server actions for CRUD operations.
 */
export default function FacultyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [faculty, setFaculty] = useState<any>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const [isDeptSlideOverOpen, setIsDeptSlideOverOpen] = useState(false);
  const [isEditFacultyOpen, setIsEditFacultyOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<
    Department | undefined
  >(undefined);
  const [editingDepartment, setEditingDepartment] = useState<
    (DepartmentFormData & { id: number }) | undefined
  >(undefined);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const facultyId = parseInt(resolvedParams.id);
    const [facultyRes, departmentsRes] = await Promise.all([
      getFacultyByIdAction(facultyId),
      getDepartmentsAction(facultyId),
    ]);

    if (facultyRes.success) {
      setFaculty(facultyRes.data);
    }
    if (departmentsRes.success) {
      setDepartments(departmentsRes.data as Department[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [resolvedParams.id]);

  const handleAddDepartment = () => {
    setEditingDepartment(undefined);
    setIsDeptSlideOverOpen(true);
  };

  const handeEditFaculty = () => {
    setIsEditFacultyOpen(true);
  };

  /**
   * Prepares the form for editing an existing department.
   * Sets the `editingDepartment` state to populate the form and opens the SlideOver.
   */
  const handleEditDepartment = (dept: Department) => {
    setEditingDepartment({
      id: dept.id,
      name: dept.name,
      facultyId: dept.facultyId,
    });
    setIsDeptSlideOverOpen(true);
  };

  /**
   * Handles creating or updating a department.
   * Determines the action based on the presence of `editingDepartment`.
   * Refreshes data and closes the form upon success.
   */
  const handleSaveDepartment = async (data: DepartmentFormData) => {
    let result;
    if (editingDepartment) {
      // Update existing department
      result = await updateDepartmentAction(editingDepartment.id, {
        name: data.name,
        facultyId: data.facultyId,
      });
    } else {
      // Create new department
      result = await createDepartmentAction({
        name: data.name,
        facultyId: parseInt(resolvedParams.id),
      });
    }

    if (result.success) {
      toast.success(
        editingDepartment
          ? "Department updated successfully"
          : "Department created successfully"
      );
      setIsDeptSlideOverOpen(false);
      setEditingDepartment(undefined);
      fetchData();
    } else {
      toast.error(
        editingDepartment
          ? "Failed to update department"
          : "Failed to create department"
      );
    }
  };

  /**
   * Updates the details of the current faculty.
   */
  const handleUpdateFaculty = async (data: FacultyFormData) => {
    const result = await updateFacultyAction(parseInt(resolvedParams.id), {
      name: data.name,
      description: data.description,
    });

    if (result.success) {
      toast.success("Faculty updated successfully");
      setIsEditFacultyOpen(false);
      fetchData();
    } else {
      toast.error("Failed to update faculty");
    }
  };

  /**
   * Executes the deletion of the confirmed department.
   * Requires `deleteConfirmation` state to be set.
   * Resets confirmation state and refreshes data on success.
   */
  const handleConfirmDelete = async () => {
    if (!deleteConfirmation) return;

    // Execute safe delete
    const result = await deleteDepartmentAction(deleteConfirmation.id);
    if (result.success) {
      toast.success("Department deleted successfully");
      fetchData();
      setDeleteConfirmation(undefined);
      setDeleteConfirmationText("");
    } else {
      toast.error("Failed to delete department");
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500">
        Loading faculty details...
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="p-12 text-center text-gray-500">Faculty not found</div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title={faculty.name}
        description={faculty.description || "No description available."}
        breadcrumb={[
          { label: "Academics", href: "/academics" },
          { label: "Faculties", href: "/academics/faculties" },
          {
            label: faculty.name,
            href: `/academics/faculties/${resolvedParams.id}`,
          },
        ]}
      >
        <button
          onClick={handeEditFaculty}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
        >
          <Edit className="w-4 h-4" />
          Edit Faculty
        </button>
      </DashboardHeader>

      {/* Faculty Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          About the Faculty
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-3xl">
          {faculty.description || "No description provided."}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100 dark:border-gray-700">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Departments
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {departments.length}
            </p>
          </div>
        </div>
      </div>

      {/* Departments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Departments
          </h2>
          <button
            onClick={handleAddDepartment}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Department
          </button>
        </div>

        <DepartmentsTable
          data={departments}
          onEdit={handleEditDepartment}
          onDelete={(dept) => setDeleteConfirmation(dept)}
        />
      </div>

      <SlideOver
        isOpen={isDeptSlideOverOpen}
        onClose={() => setIsDeptSlideOverOpen(false)}
        title={editingDepartment ? "Edit Department" : "Add New Department"}
        description={
          editingDepartment
            ? "Modify department details."
            : `Create a new department under ${faculty.name}.`
        }
      >
        <DepartmentForm
          initialData={
            editingDepartment || {
              name: "",
              facultyId: parseInt(resolvedParams.id),
            }
          }
          onSubmit={handleSaveDepartment}
          onCancel={() => setIsDeptSlideOverOpen(false)}
        />
      </SlideOver>

      <SlideOver
        isOpen={isEditFacultyOpen}
        onClose={() => setIsEditFacultyOpen(false)}
        title="Edit Faculty"
        description="Modify faculty details."
      >
        <FacultyForm
          initialData={{ name: faculty.name, description: faculty.description }}
          onSubmit={handleUpdateFaculty}
          onCancel={() => setIsEditFacultyOpen(false)}
        />
      </SlideOver>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmation}
        onClose={() => {
          setDeleteConfirmation(undefined);
          setDeleteConfirmationText("");
        }}
        title="Delete Department"
        description={`Are you sure you want to delete "${deleteConfirmation?.name}"?`}
        variant="danger"
        footer={
          <>
            <button
              onClick={() => {
                setDeleteConfirmation(undefined);
                setDeleteConfirmationText("");
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleteConfirmationText !== deleteConfirmation?.name}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p>
              This action cannot be undone. All degrees and courses associated
              with this department will be affected.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type <span className="font-bold">{deleteConfirmation?.name}</span>{" "}
              to confirm
            </label>
            <input
              type="text"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-gray-400"
              placeholder="Type department name"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
