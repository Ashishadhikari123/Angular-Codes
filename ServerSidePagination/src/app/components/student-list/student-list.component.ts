import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { StudentService } from '../../services/student.service';
import { Student, PaginatedResponse } from '../../models/student.model';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
})
export class StudentListComponent implements OnInit {
  displayedColumns: string[] = ['Id', 'FirstName', 'LastName', 'Email', 'Age'];
  dataSource: Student[] = [];
  totalRecords = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getStudents(this.pageIndex + 1, this.pageSize).subscribe({
      next: (response: PaginatedResponse) => {
        debugger
        
        this.dataSource = response.students;
        this.totalRecords = response.totalRecords;
      },
      error: (err) => console.error('Error fetching students:', err),
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadStudents();
  }
}