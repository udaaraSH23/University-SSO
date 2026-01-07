import { adminService } from "@repo/backend";
import { api } from "@/lib/api";
import { IdentityClient } from "@/components/identity/IdentityClient";

export default async function IdentityPage() {
  let initialUsers: any[] = [];
  let errorMsg = "";

  try {
    // Fetch initial users (staff)
    // Using default filters: page=1, limit=10
    const result = await api.execute(() =>
      adminService.getPaginatedStaff({
        page: 1,
        limit: 10,
      })
    );

    // Check if result has users or staff property, or is array
    initialUsers =
      (result as any).staff || (result as any).users || result || [];
    if (!Array.isArray(initialUsers)) initialUsers = [];
  } catch (error: any) {
    console.error("Failed to fetch identity data:", error);
    errorMsg = error.message;
  }

  if (errorMsg) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-lg">
        Error loading users: {errorMsg}
      </div>
    );
  }

  return <IdentityClient initialUsers={initialUsers} />;
}
