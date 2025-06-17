import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DateSelectionService, DateRange } from '../date-selection.service';

@Component({
  selector: 'app-date-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="form-group">
        <label for="dateOption">Select Date Range:</label>
        <select 
          id="dateOption" 
          class="form-control" 
          [(ngModel)]="selectedOption" 
          (ngModelChange)="onOptionChange()">
          <option value="today">Today</option>
          <option value="last1day">Last 1 Day</option>
          <option value="last3days">Last 3 Days</option>
          <option value="last15days">Last 15 Days</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div *ngIf="selectedOption === 'custom'" class="mt-3">
        <div class="form-group">
          <label for="fromDate">From Date Time:</label>
          <input 
            type="datetime-local" 
            id="fromDate" 
            class="form-control"
            [(ngModel)]="fromDateTime"
            (ngModelChange)="updateDateRange()">
        </div>
        <div class="form-group mt-2">
          <label for="toDate">To Date Time:</label>
          <input 
            type="datetime-local" 
            id="toDate" 
            class="form-control"
            [(ngModel)]="toDateTime"
            (ngModelChange)="updateDateRange()">
        </div>
      </div>

      <button class="btn btn-primary mt-3" (click)="viewDetails()">
        View Details
      </button>
    </div>
  `,
  styles: [`
    .container {
      max-width: 500px;
    }
    .form-group {
      margin-bottom: 1rem;
    }
  `]
})
export class DateSelectorComponent implements OnInit {
  selectedOption: string = 'today';
  fromDateTime: string = '';
  toDateTime: string = '';

  constructor(
    private dateSelectionService: DateSelectionService,
    private router: Router
  ) {}

  ngOnInit() {
    const currentRange = this.dateSelectionService.getCurrentDateRange();
    if (currentRange) {
      this.selectedOption = currentRange.selectedOption;
      this.fromDateTime = currentRange.fromDateTime;
      this.toDateTime = currentRange.toDateTime;
    } else {
      this.onOptionChange(); // Set default values
    }
  }

  private getStartOfDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }

  private formatDateToLocalISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onOptionChange() {
    if (this.selectedOption === 'custom') {
      return;
    }

    const now = new Date();
    let fromDate = new Date();

    // Set toDateTime to current time
    this.toDateTime = this.formatDateToLocalISO(now);

    // Calculate fromDate based on selection
    switch (this.selectedOption) {
      case 'today':
        fromDate = this.getStartOfDay(now);
        break;
      case 'last1day':
        fromDate = this.getStartOfDay(now);
        fromDate.setDate(fromDate.getDate() - 1);
        break;
      case 'last3days':
        fromDate = this.getStartOfDay(now);
        fromDate.setDate(fromDate.getDate() - 3);
        break;
      case 'last15days':
        fromDate = this.getStartOfDay(now);
        fromDate.setDate(fromDate.getDate() - 15);
        break;
    }

    this.fromDateTime = this.formatDateToLocalISO(fromDate);
    this.updateDateRange();
  }

  updateDateRange() {
    this.dateSelectionService.updateDateRange({
      fromDateTime: this.fromDateTime,
      toDateTime: this.toDateTime,
      selectedOption: this.selectedOption
    });
  }

  viewDetails() {
    this.router.navigate(['/details']);
  }
} 