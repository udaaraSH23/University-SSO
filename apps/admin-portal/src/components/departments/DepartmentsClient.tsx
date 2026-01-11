"use client";

import { DashboardHeader, SlideOver, useDeleteConfirmation } from "@repo/ui";
import { FilterWrapper } from "@/components/shared/FilterWrapper";
import {
  DepartmentsTable,
  Department,
} from "@/components/departments/DepartmentsTable";
import {
  DepartmentForm,
  DepartmentFormData,
} from "@/components/forms/DepartmentForm";
import { Plus, Search, Filter as FilterIcon } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  getDepartmentsAction,
  createDepartmentAction,
  updateDepartmentAction,
  deleteDepartmentAction,
  // getFacultiesAction, // Unused
} from "@/actions/academics.actions";
import { FacultyDTO } from "@repo/backend";

interface DepartmentsClientProps {
  initialDepartments: Department[];
  faculties: FacultyDTO[];
}

export function DepartmentsClient({
  initialDepartments,
  faculties,
}: DepartmentsClientProps) {
  const [departments, setDepartments] =
    useState<Department[]>(initialDepartments);
  const [loading, setLoading] = useState(false);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<
    DepartmentFormData | undefined
  >(undefined);
  const [editingDepartmentId, setEditingDepartmentId] = useState<number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [facultyFilter, setFacultyFilter] = useState<number | undefined>(
    undefined
  );
  const { confirmDelete } = useDeleteConfirmation();
  const searchParams = useSearchParams();

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    const result = await getDepartmentsAction(facultyFilter);
    if (result.success && result.data) {
      setDepartments(result.data as Department[]);
    } else {
      console.error("Failed to fetch departments");
    }
    setLoading(false);
  }, [facultyFilter]);

  // Only re-fetch if filters change interactively, otherwise use initial
  useEffect(() => {
    if (facultyFilter !== undefined) {
      const timer = setTimeout(() => {
        fetchDepartments();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [facultyFilter, fetchDepartments]);

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "add") {
      const timer = setTimeout(() => {
        setEditingDepartment(undefined);
        setEditingDepartmentId(null);
        setIsSlideOverOpen(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleOpenAdd = () => {
    setEditingDepartment(undefined);
    setEditingDepartmentId(null);
    setIsSlideOverOpen(true);
  };

  const handleClose = () => {
    setIsSlideOverOpen(false);
    setEditingDepartment(undefined);
    setEditingDepartmentId(null);
  };

  const handleSubmit = async (data: DepartmentFormData) => {
    let result;
    if (editingDepartmentId) {
      result = await updateDepartmentAction(editingDepartmentId, {
        name: data.name,
        facultyId: data.facultyId,
      });
    } else {
      result = await createDepartmentAction({
        name: data.name,
        facultyId: data.facultyId,
      });
    }

    if (result.success) {
      toast.success(
        editingDepartmentId
          ? "Department updated successfully"
          : "Department created successfully"
      );
      handleClose();
      fetchDepartments();
    } else {
      toast.error(
        editingDepartmentId
          ? "Failed to update department"
          : "Failed to create department"
      );
    }
  };

  const handleDeleteClick = (dept: Department) => {
    confirmDelete({
      title: "Delete Department",
      description: `Are you sure you want to delete "${dept.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        const result = await deleteDepartmentAction(dept.id);
        if (result.success) {
          toast.success("Department deleted successfully");
          fetchDepartments();
        } else {
          toast.error("Failed to delete department");
        }
      },
    });
  };

  const filteredDepartments = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.facultyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Departments"
        description="Manage university departments and their heads."
        breadcrumb={[
          { label: "Academics", href: "/academics" },
          { label: "Departments", href: "/academics/departments" },
        ]}
      >
        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </DashboardHeader>

      <FilterWrapper
        title="Departments"
        resourceCount={filteredDepartments.length}
        searchNode={
          <div className="relative w-full">
            <input
              className="w-full pl-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none text-sm"
              placeholder="Search by department name..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        }
        actions={
          <>
            <button
              onClick={() => fetchDepartments()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
            <button
              onClick={() => fetchDepartments()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap cursor-pointer"
            >
              <FilterIcon className="w-3.5 h-3.5" />
              Filter
            </button>
          </>
        }
      >
        <select
          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none text-sm"
          value={facultyFilter || ""}
          onChange={(e) =>
            setFacultyFilter(
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        >
          <option value="">All Faculties</option>
          {faculties.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </FilterWrapper>

      {loading ? (
        <div className="p-12 text-center text-gray-500">
          Loading departments...
        </div>
      ) : (
        <DepartmentsTable
          data={filteredDepartments}
          onEdit={(dept) => {
            setEditingDepartment({
              name: dept.name,
              facultyId: dept.facultyId,
            });
            setEditingDepartmentId(dept.id);
            setIsSlideOverOpen(true);
          }}
          onDelete={handleDeleteClick}
        />
      )}

      <SlideOver
        isOpen={isSlideOverOpen}
        onClose={handleClose}
        title={editingDepartment ? "Edit Department" : "Add New Department"}
        description={
          editingDepartment
            ? "Modify the details of the existing department."
            : "Create a new department under a faculty."
        }
      >
        <DepartmentForm
          initialData={editingDepartment}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </SlideOver>
    </div>
  );
}
