import {
  AdminProfileDTO,
  StaffCreateDTO,
  StaffUpdateDTO,
  StaffFiltersDTO,
  PaginatedStaffDTO,
} from "./admin.dto";

export interface IAdminService {
  getProfile(email: string): Promise<AdminProfileDTO>;
  createStaff(data: StaffCreateDTO): Promise<AdminProfileDTO>;
  updateStaff(id: number, data: StaffUpdateDTO): Promise<AdminProfileDTO>;
  deleteStaff(id: number): Promise<void>;
  getPaginatedStaff(filters: StaffFiltersDTO): Promise<PaginatedStaffDTO>;
}
