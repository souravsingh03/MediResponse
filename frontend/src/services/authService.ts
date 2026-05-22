import { api } from './api';
import { User, UserRole } from '../types';

export interface LoginResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export const loginUser = async (
  employeeId: string,
  password: string
): Promise<LoginResult> => {
  try {
    const data = await api.login(employeeId, password, '');
    if (!data.success) return { success: false, error: data.error || 'Login failed.' };

    const user: User = {
      id: data.employeeId,
      name: data.name,
      employeeId: data.employeeId,
      role: data.role as UserRole,
      department: data.department,
    };
    return { success: true, user, token: data.token };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error.' };
  }
};

export const getRoleDepartment = (role: UserRole): string => {
  const map: Record<UserRole, string> = {
    PARAMEDIC:      'Ambulance Unit',
    HOSPITAL_ADMIN: 'Hospital Admin',
    TOLL_OPERATOR:  'Toll Control',
  };
  return map[role];
};
