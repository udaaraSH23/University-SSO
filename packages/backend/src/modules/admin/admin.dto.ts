export interface StaffCreateDTO {
  username: string;
  email: string;
  fullName: string;
  role: "Admin" | "Librarian";
  staffType: string;
}

export interface AdminProfileDTO {
  id: number;
  fullName: string;
  email: string;
  staffType: string;
}

export interface StaffFiltersDTO {
  page?: number;
  limit?: number;
  query?: string;
  role?: string;
}

export interface PaginatedStaffDTO {
  staff: (AdminProfileDTO & {
    username: string;
    role: string;
    status: string;
  })[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StaffUpdateDTO {
  fullName?: string;
  staffType?: string;
}
