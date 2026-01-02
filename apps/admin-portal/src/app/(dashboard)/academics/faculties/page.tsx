"use client";

// Author: UDARA SHANUKA
// Project: University-Portal
// FP-ID: FP-20260101-ADMIN-FACULTIES-PAGE
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-01T12:09:41+05:30

const __FP_SIG = "FP-20260101-ADMIN-FACULTIES-PAGE|HASH-PLACEHOLDER";

import { DashboardHeader, SlideOver, useDeleteConfirmation } from "@repo/ui";
import {
  FacultyCard,
  FacultyCardProps,
} from "@/components/academics/FacultyCard";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FacultyForm, FacultyFormData } from "@/components/forms/FacultyForm";
import { toast } from "sonner";
import {
  getFacultiesAction,
  createFacultyAction,
  updateFacultyAction,
  deleteFacultyAction,
} from "@/actions/academics.actions";

/**
 * FacultiesPage
 *
 * Purpose:
 * - Displays a grid of all university faculties.
 * - Provides management capabilities (Add, Edit, Delete).
 * - Navigates to Faculty details.
 *
 * Responsibilities:
 * - Fetching and displaying the list of faculties.
 * - Managing the state for "Add/Edit" forms via SlideOver.
 * - Handling text-based delete confirmation.
 * - Rendering dynamic department counts for each faculty.
 */
export default function FacultiesPage() {
  const [faculties, setFaculties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<
    FacultyFormData | undefined
  >(undefined);
  const [editingFacultyId, setEditingFacultyId] = useState<number | null>(null);
  const { confirmDelete } = useDeleteConfirmation();

  const searchParams = useSearchParams();

  const fetchFaculties = async () => {
    setLoading(true);
    const result = await getFacultiesAction();
    if (result.success && result.data) {
      setFaculties(result.data);
    } else {
      console.error("Failed to load faculties");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setEditingFaculty(undefined);
      setEditingFacultyId(null);
      setIsSlideOverOpen(true);
    }
  }, [searchParams]);

  const handleOpenAdd = () => {
    setEditingFaculty(undefined);
    setEditingFacultyId(null);
    setIsSlideOverOpen(true);
  };

  const handleClose = () => {
    setIsSlideOverOpen(false);
    setEditingFaculty(undefined);
    setEditingFacultyId(null);
  };

  const handleSubmit = async (data: FacultyFormData) => {
    let result;
    if (editingFacultyId) {
      result = await updateFacultyAction(editingFacultyId, {
        name: data.name,
        description: data.description,
      });
    } else {
      result = await createFacultyAction({
        name: data.name,
        description: data.description,
      });
    }

    if (result.success) {
      toast.success(
        editingFacultyId
          ? "Faculty updated successfully"
          : "Faculty created successfully"
      );
      handleClose();
      fetchFaculties();
    } else {
      toast.error(
        editingFacultyId
          ? "Failed to update faculty"
          : "Failed to create faculty"
      );
    }
  };

  const handleDeleteClick = (faculty: any) => {
    confirmDelete({
      title: "Delete Faculty",
      description: `Are you sure you want to delete "${faculty.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        const result = await deleteFacultyAction(faculty.id);
        if (result.success) {
          toast.success("Faculty deleted successfully");
          fetchFaculties();
        } else {
          toast.error("Failed to delete faculty");
        }
      },
    });
  };

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Faculties"
        description="Overview of university faculties and their departments."
        breadcrumb={[
          { label: "Academics", href: "/academics" },
          { label: "Faculties", href: "/academics/faculties" },
        ]}
      >
        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Faculty
        </button>
      </DashboardHeader>

      {loading ? (
        <div className="p-12 text-center text-gray-500">
          Loading faculties...
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {faculties.map((faculty) => (
            <FacultyCard
              key={faculty.id}
              id={faculty.id}
              name={faculty.name}
              description={faculty.description}
              departmentCount={faculty.departmentCount || 0}
              onEdit={() => {
                setEditingFaculty({
                  name: faculty.name,
                  description: faculty.description,
                });
                setEditingFacultyId(faculty.id);
                setIsSlideOverOpen(true);
              }}
              onDelete={() => handleDeleteClick(faculty)}
            />
          ))}
          {!loading && faculties.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              No faculties found. Create one to get started.
            </div>
          )}
        </div>
      )}

      <SlideOver
        isOpen={isSlideOverOpen}
        onClose={handleClose}
        title={editingFaculty ? "Edit Faculty" : "Add New Faculty"}
        description={
          editingFaculty
            ? "Modify the details of the existing faculty."
            : "Create a new faculty to organize departments and programs."
        }
      >
        <FacultyForm
          initialData={editingFaculty}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </SlideOver>
    </div>
  );
}
