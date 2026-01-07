"use client";

import { DashboardHeader, SlideOver, useDeleteConfirmation } from "@repo/ui";
import { FacultyCard } from "@/components/academics/FacultyCard";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FacultyForm, FacultyFormData } from "@/components/forms/FacultyForm";
import { toast } from "sonner";
import {
  createFacultyAction,
  updateFacultyAction,
  deleteFacultyAction,
} from "@/actions/academics.actions";

interface FacultiesClientProps {
  initialFaculties: any[];
}

export function FacultiesClient({ initialFaculties }: FacultiesClientProps) {
  // Use initial data, but allow updates via router refresh or manual management
  // For simplicity simpler to just trust server revalidation + router.refresh()
  // but here we might want local state to update immediately.
  // Given the structure, let's just use initial data passed down.
  // Revalidation handled by actions should refresh the server component.

  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<
    FacultyFormData | undefined
  >(undefined);
  const [editingFacultyId, setEditingFacultyId] = useState<number | null>(null);
  const { confirmDelete } = useDeleteConfirmation();
  const searchParams = useSearchParams();

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
      // In a real app we might call router.refresh() here to re-run server component
      // but the action already calls revalidatePath.
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

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {initialFaculties.map((faculty) => (
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
        {initialFaculties.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            No faculties found. Create one to get started.
          </div>
        )}
      </div>

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
