import { UserRole } from './user.entity';

export interface User {
  id?: number;
  email: string;
  password: string;
  role: UserRole;
  isActive?: boolean;
}
