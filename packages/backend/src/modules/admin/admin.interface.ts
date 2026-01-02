import { AdminProfileDTO, StaffCreateDTO } from "./admin.dto";

export interface IAdminService {
  getProfile(email: string): Promise<AdminProfileDTO>;
  createStaff(data: StaffCreateDTO): Promise<AdminProfileDTO>;
}
