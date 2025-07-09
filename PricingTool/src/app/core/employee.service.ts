import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { Employee } from '../models/employee.model';
import { map, switchMap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private apiUrl = 'http://localhost:3000/employees';
  private configUrl = 'http://localhost:3000/config';
  private localEmployees: Employee[] = []; // Local state for demonstration

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    // If we have local data, use it; otherwise fetch from API
    if (this.localEmployees.length > 0) {
      return of(this.localEmployees);
    }
    return this.http.get<Employee[]>(this.apiUrl).pipe(
      map(employees => {
        this.localEmployees = [...employees];
        return this.localEmployees;
      })
    );
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee).pipe(
      map(newEmployee => {
        // Also add to local state
        this.localEmployees.push(newEmployee);
        return newEmployee;
      })
    );
  }

  getColumns(): Observable<string[]> {
    return this.http.get<{ columns: string[] }>(this.configUrl).pipe(
      map(res => res.columns)
    );
  }

  getConfig(): Observable<any> {
    return this.http.get<any>(this.configUrl);
  }

  updateColumns(columns: string[]): Observable<any> {
    return this.getConfig().pipe(
      take(1),
      switchMap(config => this.http.patch(this.configUrl, { ...config, columns }))
    );
  }

  addMultipleEmployees(employees: Employee[]): Observable<Employee[]> {
    // For bulk insertion, we'll add them one by one and return all results
    // In a real app, you might have a bulk endpoint
    const requests = employees.map(emp => this.http.post<Employee>(this.apiUrl, emp));
    return requests.length > 0 ? forkJoin(requests) : of([]);
  }

  insertEmployeesAtPosition(employees: Employee[], position: 'top' | 'bottom' | 'before' | 'after', targetIndex?: number): Observable<Employee[]> {
    return this.getEmployees().pipe(
      take(1),
      map(currentEmployees => {
        let newEmployees: Employee[] = [];
        
        // Create empty employee objects with default values and unique IDs
        const emptyEmployees = employees.map((_, index) => {
          const emptyEmployee: Employee = {
            id: Date.now() + index, // Temporary unique ID for empty rows
            name: '',
            experience: 0,
            salary: 0,
            company: '',
            location: '',
            address: ''
          };
          return emptyEmployee;
        });

        console.log('=== INSERTION DEBUG ===');
        console.log('Position:', position);
        console.log('Target Index:', targetIndex);
        console.log('Current employees count:', currentEmployees.length);
        console.log('Empty employees to insert:', emptyEmployees.length);
        console.log('Target index valid:', targetIndex !== undefined && targetIndex >= 0);

        switch (position) {
          case 'top':
            console.log('Inserting at TOP');
            newEmployees = [...emptyEmployees, ...currentEmployees];
            break;
          case 'bottom':
            console.log('Inserting at BOTTOM');
            newEmployees = [...currentEmployees, ...emptyEmployees];
            break;
          case 'before':
            if (targetIndex !== undefined && targetIndex >= 0) {
              console.log('Inserting BEFORE index:', targetIndex);
              console.log('Slice 1 (0 to targetIndex):', currentEmployees.slice(0, targetIndex).length);
              console.log('Slice 2 (targetIndex to end):', currentEmployees.slice(targetIndex).length);
              newEmployees = [
                ...currentEmployees.slice(0, targetIndex),
                ...emptyEmployees,
                ...currentEmployees.slice(targetIndex)
              ];
            } else {
              console.log('Invalid targetIndex for BEFORE, defaulting to TOP');
              newEmployees = [...emptyEmployees, ...currentEmployees];
            }
            break;
          case 'after':
            if (targetIndex !== undefined && targetIndex >= 0) {
              console.log('Inserting AFTER index:', targetIndex);
              console.log('Slice 1 (0 to targetIndex+1):', currentEmployees.slice(0, targetIndex + 1).length);
              console.log('Slice 2 (targetIndex+1 to end):', currentEmployees.slice(targetIndex + 1).length);
              newEmployees = [
                ...currentEmployees.slice(0, targetIndex + 1),
                ...emptyEmployees,
                ...currentEmployees.slice(targetIndex + 1)
              ];
            } else {
              console.log('Invalid targetIndex for AFTER, defaulting to BOTTOM');
              newEmployees = [...currentEmployees, ...emptyEmployees];
            }
            break;
        }

        console.log('New employees count after insertion:', newEmployees.length);
        console.log('=== INSERTION COMPLETE ===');
        
        // Update local state
        this.localEmployees = [...newEmployees];
        return this.localEmployees;
      })
    );
  }



  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map(result => {
        // Also remove from local state
        this.localEmployees = this.localEmployees.filter(emp => emp.id !== id);
        return result;
      })
    );
  }

  refreshEmployees(): Observable<Employee[]> {
    // Force refresh from API and update local state
    return this.http.get<Employee[]>(this.apiUrl).pipe(
      map(employees => {
        this.localEmployees = [...employees];
        return this.localEmployees;
      })
    );
  }

  // Test method to verify insertion logic
  testInsertionLogic() {
    const testEmployees = [
      { id: 1, name: 'Alice', experience: 5, salary: 70000, company: 'TechCorp', location: 'NY', address: '123 Main' },
      { id: 2, name: 'Bob', experience: 3, salary: 60000, company: 'InnovateX', location: 'SF', address: '456 Market' },
      { id: 3, name: 'Charlie', experience: 7, salary: 80000, company: 'DevSolutions', location: 'Chicago', address: '789 Lake' }
    ];
    
    const emptyRow = { id: 999, name: '', experience: 0, salary: 0, company: '', location: '', address: '' };
    
    console.log('=== TESTING INSERTION LOGIC ===');
    console.log('Original array:', testEmployees.map(e => e.name));
    
    // Test BEFORE insertion at index 1
    const beforeResult = [
      ...testEmployees.slice(0, 1),
      emptyRow,
      ...testEmployees.slice(1)
    ];
    console.log('BEFORE index 1:', beforeResult.map(e => e.name));
    
    // Test AFTER insertion at index 1
    const afterResult = [
      ...testEmployees.slice(0, 2),
      emptyRow,
      ...testEmployees.slice(2)
    ];
    console.log('AFTER index 1:', afterResult.map(e => e.name));
  }
} 