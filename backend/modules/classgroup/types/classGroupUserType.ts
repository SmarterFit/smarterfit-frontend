export interface MemberClassGroupUserDTO {
  classGroupId: string;     
  userId: string;           
  subscriptionId: string;   
}

export interface EmployeeClassGroupUserDTO {
  classGroupId: string;     
}

export interface ClassUsersResponseDTO {
  userId: string; // UUID como string no frontend
  name: string;
  email: string;
  isTeacher: boolean;
}
