"use client";

import { DashboardHeader, SlideOver, Modal } from "@repo/ui";
import { DegreesTable, DegreeProgram } from "@/components/degrees/DegreesTable";
import { DegreeForm, DegreeFormData } from "@/components/forms/DegreeForm";
import {
  DepartmentForm,
  DepartmentFormData,
} from "@/components/forms/DepartmentForm";
import { useState, useEffect, use } from "react";
import { Plus, Edit } from "lucide-react";

import {
  getDepartmentByIdAction,
  getDegreeProgramsAction,
  createDegreeProgramAction,
  updateDepartmentAction,
  deleteDegreeProgramAction,
} from "@/actions/academics.actions";
import { toast } from "sonner";

export default function DepartmentDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const resolvedParams = use(params);

  const [department, setDepartment] = useState<any>(null);
  const [degrees, setDegrees] = useState<DegreeProgram[]>([]);
  const [loading, setLoading] = useState(true);

  const [isDegreeSlideOverOpen, setIsDegreeSlideOverOpen] = useState(false);
  const [isEditDepartmentOpen, setIsEditDepartmentOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<
    DegreeProgram | undefined
  >(undefined);

  const fetchData = async () => {
    setLoading(true);
    const departmentId = Number.parseInt(resolvedParams.id);
    const [deptRes, degreeRes] = await Promise.all([
      getDepartmentByIdAction(departmentId),
      getDegreeProgramsAction(departmentId),
    ]);

    if (deptRes.success) {
      setDepartment(deptRes.data);
    }
    if (degreeRes.success) {
      setDegrees(degreeRes.data as DegreeProgram[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [resolvedParams.id]);

  const handleAddDegree = () => {
    setIsDegreeSlideOverOpen(true);
  };

  const handleEditDepartment = () => {
    setIsEditDepartmentOpen(true);
  };

  const handleCreateDegree = async (data: DegreeFormData) => {
    const result = await createDegreeProgramAction({
      name: data.name,
      departmentId: Number.parseInt(resolvedParams.id),
      intakeAcademicYear: data.intakeAcademicYear,
    });

    if (result.success) {
      toast.success("Degree program created successfully");
      setIsDegreeSlideOverOpen(false);
      fetchData();
    } else {
      toast.error("Failed to create degree program");
    }
  };

  const handleUpdateDepartment = async (data: DepartmentFormData) => {
    const result = await updateDepartmentAction(
      Number.parseInt(resolvedParams.id),
      {
        name: data.name,
        facultyId: data.facultyId,
      }
    );

    if (result.success) {
      toast.success("Department updated successfully");
      setIsEditDepartmentOpen(false);
      fetchData();
    } else {
      toast.error("Failed to update department");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmation) return;

    const result = await deleteDegreeProgramAction(deleteConfirmation.id);
    if (result.success) {
      toast.success("Degree program deleted successfully");
      fetchData();
      setDeleteConfirmation(undefined);
    } else {
      toast.error("Failed to delete degree program");
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500">
        Loading department details...
      </div>
    );
  }

  if (!department) {
    return (
      <div className="p-12 text-center text-gray-500">Department not found</div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title={department.name}
        description={`Faculty: ${department.facultyName}`}
        breadcrumb={[
          { label: "Academics", href: "/academics" },
          { label: "Departments", href: "/academics/departments" },
          {
            label: department.name,
            href: `/academics/departments/${resolvedParams.id}`,
          },
        ]}
      >
        <button
          onClick={handleEditDepartment}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
        >
          <Edit className="w-4 h-4" />
          Edit Department
        </button>
      </DashboardHeader>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          About the Department
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100 dark:border-gray-700">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Faculty
            </p>
            <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
              {department.facultyName}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Degrees Offered
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {degrees.length}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Degrees
          </h2>
          <button
            onClick={handleAddDegree}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Degree
          </button>
        </div>

        <DegreesTable
          data={degrees}
          onEdit={(degree) => console.log("Edit degree", degree)}
          onDelete={(degree) => setDeleteConfirmation(degree)}
        />
      </div>

      <SlideOver
        isOpen={isDegreeSlideOverOpen}
        onClose={() => setIsDegreeSlideOverOpen(false)}
        title="Add New Degree Program"
        description={`Create a new degree program under ${department.name}.`}
      >
        <DegreeForm
          initialData={{
            name: "",
            departmentId: Number.parseInt(resolvedParams.id),
            intakeAcademicYear: new Date().getFullYear().toString(),
          }}
          onSubmit={handleCreateDegree}
          onCancel={() => setIsDegreeSlideOverOpen(false)}
        />
      </SlideOver>

      <SlideOver
        isOpen={isEditDepartmentOpen}
        onClose={() => setIsEditDepartmentOpen(false)}
        title="Edit Department"
        description="Modify department details."
      >
        <DepartmentForm
          initialData={{
            name: department.name,
            facultyId: department.facultyId,
          }}
          onSubmit={handleUpdateDepartment}
          onCancel={() => setIsEditDepartmentOpen(false)}
        />
      </SlideOver>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(undefined)}
        title="Delete Degree Program"
        description={`Are you sure you want to delete "${deleteConfirmation?.name}"?`}
        variant="danger"
        footer={
          <>
            <button
              onClick={() => setDeleteConfirmation(undefined)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </>
        }
      >
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <p>
            This action cannot be undone. All courses and student records
            associated with this degree program might be affected.
          </p>
        </div>
      </Modal>
    </div>
  );
}
