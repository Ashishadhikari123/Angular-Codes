export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
}

export interface PaginatedResponse {
  students: Student[];
  totalRecords: number;
}