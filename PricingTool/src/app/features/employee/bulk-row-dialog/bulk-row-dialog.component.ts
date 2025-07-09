import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../../../shared/material.module';

export interface BulkRowDialogData {
  totalRows: number;
  selectedRowIndex?: number;
  selectedRowData?: any;
}

export interface BulkRowDialogResult {
  numberOfRows: number;
  insertPosition: 'top' | 'bottom' | 'before' | 'after';
  targetIndex?: number;
}

@Component({
  selector: 'app-bulk-row-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  template: `
    <h2 mat-dialog-title>Insert Rows</h2>
    <form [formGroup]="form" (ngSubmit)="onInsert()">
      <mat-dialog-content class="dialog-content">
        <div class="form-section">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Number of rows to insert</mat-label>
            <input matInput type="number" formControlName="numberOfRows" min="1" max="100">
            <mat-error *ngIf="form.get('numberOfRows')?.hasError('required')">
              Number of rows is required
            </mat-error>
            <mat-error *ngIf="form.get('numberOfRows')?.hasError('min')">
              Must be at least 1 row
            </mat-error>
            <mat-error *ngIf="form.get('numberOfRows')?.hasError('max')">
              Maximum 100 rows allowed
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-section">
          <mat-label class="section-label">Insert Position</mat-label>
          <mat-radio-group formControlName="insertPosition" class="radio-group">
            <mat-radio-button value="top" class="radio-option">
              At the beginning (top)
            </mat-radio-button>
            <mat-radio-button value="bottom" class="radio-option">
              At the end (bottom)
            </mat-radio-button>
            <mat-radio-button 
              value="before" 
              class="radio-option"
              [disabled]="data.selectedRowIndex === undefined">
              Before selected row
              <span *ngIf="data.selectedRowIndex !== undefined" class="row-info">
                (Row {{ data.selectedRowIndex + 1 }}: {{ getRowDisplayText() }})
              </span>
            </mat-radio-button>
            <mat-radio-button 
              value="after" 
              class="radio-option"
              [disabled]="data.selectedRowIndex === undefined">
              After selected row
              <span *ngIf="data.selectedRowIndex !== undefined" class="row-info">
                (Row {{ data.selectedRowIndex + 1 }}: {{ getRowDisplayText() }})
              </span>
            </mat-radio-button>
          </mat-radio-group>
        </div>

        <div class="info-section" *ngIf="data.selectedRowIndex === undefined">
          <mat-icon>info</mat-icon>
          <span>To insert before/after a specific row, right-click on a row in the table and select "Insert Rows"</span>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          Insert {{ form.get('numberOfRows')?.value || 0 }} Row(s)
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .dialog-content {
      min-width: 400px;
      padding: 20px 0;
    }
    
    .form-section {
      margin-bottom: 24px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .section-label {
      font-weight: 500;
      margin-bottom: 12px;
      display: block;
      color: rgba(0, 0, 0, 0.87);
    }
    
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .radio-option {
      margin-bottom: 8px;
    }
    
    .row-info {
      font-size: 0.875em;
      color: rgba(0, 0, 0, 0.6);
      margin-left: 8px;
    }
    
    .info-section {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px;
      background-color: #e3f2fd;
      border-radius: 4px;
      margin-top: 16px;
    }
    
    .info-section mat-icon {
      color: #1976d2;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    .info-section span {
      font-size: 0.875em;
      color: #1565c0;
    }

    mat-dialog-actions {
      padding: 16px 0 0 0;
      margin: 0;
    }
  `]
})
export class BulkRowDialogComponent {
  form: FormGroup;

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<BulkRowDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: BulkRowDialogData & { defaultPosition?: 'before' | 'after' | 'top' | 'bottom' }) {
    // Use the value passed in data for default position if present
    const defaultPosition = data.defaultPosition || (typeof data.selectedRowIndex === 'number' && !isNaN(data.selectedRowIndex) ? 'after' : 'bottom');
    this.form = this.fb.group({
      numberOfRows: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      insertPosition: [defaultPosition, Validators.required]
    });
    // Debug logging
    console.log('Dialog data:', this.data);
    console.log('selectedRowIndex:', this.data.selectedRowIndex, typeof this.data.selectedRowIndex);
    console.log('defaultPosition:', defaultPosition);
  }

  onInsert() {
    if (this.form.valid) {
      // Ensure targetIndex is a number or undefined
      const targetIndex = (typeof this.data.selectedRowIndex === 'number' && !isNaN(this.data.selectedRowIndex)) ? this.data.selectedRowIndex : undefined;
      const result: BulkRowDialogResult = {
        numberOfRows: this.form.value.numberOfRows,
        insertPosition: this.form.value.insertPosition,
        targetIndex
      };
      // Debug logging
      console.log('Dialog onInsert result:', result);
      this.dialogRef.close(result);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  getRowDisplayText(): string {
    if (this.data.selectedRowData) {
      return this.data.selectedRowData.name || 
             this.data.selectedRowData.id || 
             'Selected Row';
    }
    return 'Selected Row';
  }
} 