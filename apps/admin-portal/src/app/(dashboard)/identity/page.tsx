"use client";

import { DashboardHeader, FilterWrapper, SlideOver } from "@repo/ui";
import { UsersTable, UserData } from "@/components/identity/UsersTable";
import { UserForm, UserFormData } from "@/components/forms/UserForm";
import { Plus, Search } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export default function IdentityPage() {
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserFormData | undefined>(
    undefined
  );
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    limit: 10,
  });

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        type: "staff",
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      });
      if (filters.search) queryParams.set("search", filters.search);

      const res = await fetch(`/api/admin/users?${queryParams}`);
      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data.staff || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenAdd = () => {
    setEditingUser(undefined);
    setEditingUserId(null);
    setIsSlideOverOpen(true);
  };

  const handleClose = () => {
    setIsSlideOverOpen(false);
    setEditingUser(undefined);
    setEditingUserId(null);
  };

  const handleSubmit = async (data: UserFormData) => {
    try {
      const payload = {
        type: "staff",
        data: {
          ...data,
          // If creating, we ensure staffType is sent. Logic handled in form.
        },
      };

      let res;
      if (editingUserId) {
        // Edit Mode
        // Note: Currently API PATCH might not fully support all fields needed,
        // but passing data as is.
        res = await fetch(`/api/admin/users/${editingUserId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create Mode
        res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Operation failed");
      }

      toast.success(
        editingUserId
          ? "User updated successfully"
          : "User created successfully"
      );
      handleClose();
      fetchUsers();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message || "Failed to save user");
    }
  };

  const handleDelete = async (id: string, provider: "local" | "wso2") => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    )
      return;

    try {
      const res = await fetch(`/api/admin/users/${id}?provider=${provider}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Delete failed");
      }

      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete user");
    }
  };

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Identity & Access"
        description="Manage administrative users, librarians, and staff access."
        breadcrumb={[{ label: "Identity & Access", href: "/identity" }]}
      >
        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </DashboardHeader>

      <FilterWrapper
        title="Filter Users"
        actions={
          <button
            onClick={() => fetchUsers()}
            className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Role
            </label>
            <select className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 outline-none">
              <option>All Roles</option>
              <option>Administrator</option>
              <option>Librarian</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Search
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full pl-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 outline-none"
              />
            </div>
          </div>
        </div>
      </FilterWrapper>

      <div className="mt-4">
        <UsersTable
          users={users}
          isLoading={isLoading}
          onEdit={(user) => {
            setEditingUser({
              username: user.username,
              email: user.email,
              role: user.role as "Admin" | "Librarian",
              fullName: user.fullName,
              staffType: user.staffType,
            });
            setEditingUserId(user.id);
            setIsSlideOverOpen(true);
          }}
          onDelete={handleDelete}
        />
      </div>

      <SlideOver
        isOpen={isSlideOverOpen}
        onClose={handleClose}
        title={editingUser ? "Edit User" : "Add New User"}
        description={
          editingUser
            ? "Update user details and access rights."
            : "Create a new administrative or staff account."
        }
      >
        <UserForm
          initialData={editingUser}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </SlideOver>
    </div>
  );
}
