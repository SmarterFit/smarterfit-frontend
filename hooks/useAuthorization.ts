// hooks/useAuthorization.ts
import { useUser } from "./useUser";
import { RoleType } from "@/backend/common/enums/rolesEnum";

export function useAuthorization() {
  const user = useUser();

  const hasRole = (rolesToCheck: RoleType[]): boolean => {
    if (!user || !user.roles) return false;
    return rolesToCheck.some(role => user.roles.includes(role));
  };

  return {
    user,
    hasRole,
    isMember: () => hasRole([RoleType.MEMBER]),
    isTrainer: () => hasRole([RoleType.TRAINER]),
    isPersonalTrainer: () => hasRole([RoleType.PERSONAL_TRAINER]),
    isReceptionist: () => hasRole([RoleType.RECEPTIONIST]),
    isEmployee: () => hasRole([RoleType.EMPLOYEE]),
    isAdmin: () => hasRole([RoleType.ADMIN]),
  };
}
