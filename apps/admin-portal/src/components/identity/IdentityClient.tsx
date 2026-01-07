"use client";

import { DashboardHeader, SlideOver, useDeleteConfirmation } from "@repo/ui";
import { FilterWrapper } from "@/components/shared/FilterWrapper";
import { UsersTable, UserData } from "@/components/identity/UsersTable";
import { UserForm, UserFormData } from "@/components/forms/UserForm";
import { Plus, Search, Filter as FilterIcon } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Since we are moving away from api routes for fetching, but maybe for mutations we still use actions or api routes?
// The original used fetch('/api/admin/users...').
// Ideally we should use Server Actions for mutations too to be consistent.
// However, the original code used fetch. I will stick to the plan of refactoring data fetching to Server Component.
// Mutations will remain as fetch if no actions exist, or I can create them.
// But wait, the objective is "Refactor existing data fetching".
// I will keep mutations as is for now, or use the existing API routes if they work.
// But wait, if I refactor data fetching, I need to pass initial data.

interface IdentityClientProps {
  initialUsers: UserData[];
}

export function IdentityClient({ initialUsers }: IdentityClientProps) {
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserFormData | undefined>(
    undefined
  );
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    limit: 10,
  });
  const { confirmDelete } = useDeleteConfirmation();
  const router = useRouter();

  // We should still support client-side refreshing/filtering if needed.
  // But if we want to be consistent with Server Components, search/filter should update URL.
  // The original component used client-side fetch.
  // I will adapt it to use URL params for search/filter if I can, OR keep client-side fetch for updates.
  // But `api.execute` is server-side.
  // So for filtering, I should stick to client-side fetch (which calls the API route) OR reload page with params.
  // Given standard is Server Actions or API routes for client interaction.
  // The existing code uses `/api/admin/users`.
  // I will keep using that for client-side interactions to minimize disruption,
  // BUT initial load is now server-side.

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

  // If filters change (and it's not the initial render), we fetch.
  // Standard pattern: useEffect dependency on filters.
  // BUT we have initial data.
  // If I start with initialData, I don't need to fetch on mount.
  // Use a ref to track if it's first render?
  // Or just rely on the fact that filters state initializes to default and if I change it, it fetches.

  // Actually, keeping the client-side fetch for filtering is easiest way to support the existing SEARCH/FILTER UI without re-writing generic components to use URL params.

  useEffect(() => {
    // Skip initial fetch if we have users?
    // But filters might need to trigger fetch if they change.
    // The original had: useEffect(() => { fetchUsers() }, [fetchUsers]);
    // I entered this component with initialUsers matching default filters.
    // So I can skip the *first* effect run if matches defaults.
    // Or simpler: Just let it handle updates.
  }, []);

  // Instead of auto-fetching on mount, we only fetch when filters change from default?
  // Or just keep the fetchUsers but remove the auto-call on mount.
  // The user triggers search via button in original code?
  // "onClick={() => fetchUsers()}"

  // So I can just remove the automatic useEffect and rely on manual trigger + Search/Filter buttons,
  // plus maybe pagination (if I implement it, original code had fetchUsers depend on filters).

  // Wait, original code:
  // useEffect(() => { fetchUsers(); }, [fetchUsers]); -> fetchUsers depends on filters.
  // So it auto-fetched on mount.
  // Now I have data. I should disable auto-fetch on mount.

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
        },
      };

      let res;
      if (editingUserId) {
        res = await fetch(`/api/admin/users/${editingUserId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
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
    confirmDelete({
      title: "Delete User",
      description:
        "Are you sure you want to delete this user? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/users/${id}`, {
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
      },
    });
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
        searchNode={
          <div className="relative w-full">
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
        }
        actions={
          <>
            <button
              onClick={() => fetchUsers()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
            <button
              onClick={() => fetchUsers()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap cursor-pointer"
            >
              <FilterIcon className="w-3.5 h-3.5" />
              Filter
            </button>
          </>
        }
      >
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
