import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DateSelectionService, DateRange } from '../date-selection.service';

@Component({
  selector: 'app-date-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Selected Date Range Details</h2>
      
      <div class="card mt-3" *ngIf="dateRange">
        <div class="card-body">
          <p><strong>Selected Option:</strong> {{ dateRange.selectedOption }}</p>
          <p><strong>From Date Time:</strong> {{ formatDateTime(dateRange.fromDateTime, true) }}</p>
          <p><strong>To Date Time:</strong> {{ formatDateTime(dateRange.toDateTime, false) }}</p>
        </div>
      </div>

      <button class="btn btn-secondary mt-3" (click)="goBack()">
        Back
      </button>
    </div>
  `,
  styles: [`
    .container {
      max-width: 500px;
    }
    .card {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class DateDetailsComponent implements OnInit {
  dateRange: DateRange | null = null;

  constructor(
    private dateSelectionService: DateSelectionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.dateRange = this.dateSelectionService.getCurrentDateRange();
    if (!this.dateRange) {
      this.goBack();
    }
  }

  formatDateTime(dateTime: string, isFromDate: boolean): string {
    const date = new Date(dateTime);
    
    if (isFromDate) {
      // For fromDateTime, always show as 00:00:00
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day} 00:00:00`;
    } else {
      // For toDateTime, show actual time in 24-hour format
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
} 