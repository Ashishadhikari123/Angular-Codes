import { Injectable } from '@angular/core';

export interface DateRange {
  fromDateTime: string;
  toDateTime: string;
  selectedOption: string;
}

@Injectable({
  providedIn: 'root'
})
export class DateSelectionService {
  private readonly STORAGE_KEY = 'dateRangeSelection';

  constructor() {
    // Initialize default state if nothing is stored
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const defaultState: DateRange = {
        fromDateTime: new Date().toISOString().slice(0, 16),
        toDateTime: new Date().toISOString().slice(0, 16),
        selectedOption: 'today'
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultState));
    }
  }

  updateDateRange(dateRange: DateRange): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dateRange));
  }

  getCurrentDateRange(): DateRange {
    const savedState = localStorage.getItem(this.STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  }
} 