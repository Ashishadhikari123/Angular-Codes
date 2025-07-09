export interface Employee {
  id?: number;
  name: string;
  experience: number;
  salary: number;
  company: string;
  location: string;
  address: string;
  [key: string]: any; // For dynamic columns
} 