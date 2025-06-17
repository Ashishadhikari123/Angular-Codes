import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-table',
  standalone: true,
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    HttpClientModule
  ]
})
export class StudentTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'age', 'course', 'college'];
  students: any[] = [];
  totalRecords = 0;
  pageSize = 5;
  pageIndex = 0;
  isDataLoaded = false;
  isDataLoading = false; // <-- Added this for shimmer effect

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    // Don't load until button is clicked
  }

  getStudentData(): void {
    const page = this.pageIndex + 1;
    const pageSize = this.pageSize;

    this.isDataLoading = true;
    this.isDataLoaded = false;

    this.http
      .get<any>(`http://localhost:8080/students?page=${page}&pageSize=${pageSize}`)
      .subscribe({
        next: (res) => {
          // this.students = res.data;
          // this.totalRecords = res.totalCount;
          // this.isDataLoaded = true;
          // this.isDataLoading = false; // <-- Stop shimmer effect

          // Simulate 3-second delay before showing data
        setTimeout(() => {
          this.students = res.data;
          this.totalRecords = res.totalCount;
          this.isDataLoaded = true;
          this.isDataLoading = false;
        }, 3000);
        },
        error: (err) => {
          console.error('Error fetching student data:', err);
          this.isDataLoading = false;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getStudentData();
  }
}
