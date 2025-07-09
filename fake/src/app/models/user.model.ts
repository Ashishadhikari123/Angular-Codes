export interface User {
    id: number;
    employee_id: string;
    name: string;
    experience: number;
    salary: number;
    company: string;
    location: string;
    address: string;
    email: string;
    phone: string;
    designation: string;
    department: string;
    dateOfJoining: string;
    employeeType: string;
    manager: string;
    employeeCode: string;
    nationality: string;
    dob: string;
    gender: string;
    maritalStatus: string;
    bloodGroup: string;
    [key: string]: any; // Allow dynamic properties
  }