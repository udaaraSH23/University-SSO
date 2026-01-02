"use client";
import { motion } from "framer-motion";
import { Edit2, Shield, User, Trash2 } from "lucide-react";

export interface UserData {
  id: string; // Database ID as string or number
  fullName: string;
  email: string;
  role: string;
  username: string;
  status: string;
  staffType: string;
}

interface UsersTableProps {
  users: UserData[];
  isLoading?: boolean;
  onEdit: (user: UserData) => void;
  onDelete: (id: string, provider: "local" | "wso2") => void;
}

export function UsersTable({
  users,
  isLoading,
  onEdit,
  onDelete,
}: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center text-gray-500">
        No users found.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Staff Type</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                      {user.fullName ? user.fullName.charAt(0) : "U"}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {user.fullName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    {user.role === "Admin" ? (
                      <Shield className="w-4 h-4 text-purple-500" />
                    ) : (
                      <User className="w-4 h-4 text-blue-500" />
                    )}
                    <span className="font-medium">{user.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{user.staffType}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(user.id, "wso2")}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete from Identity Server & DB"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
