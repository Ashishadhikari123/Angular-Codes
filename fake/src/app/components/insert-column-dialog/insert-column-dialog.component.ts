import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-insert-column-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDialogModule,
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title>Add Column</h2>
    <mat-dialog-content>
      <div class="form-group">
        <mat-form-field appearance="outline" style="width: 100%;" floatLabel="always">
          <mat-label>Number of Columns</mat-label>
          <input matInput type="number" [(ngModel)]="numberOfColumns" min="1" max="10" (change)="onNumberOfColumnsChange()">
        </mat-form-field>
      </div>
      
      <div class="form-group">
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Position</mat-label>
          <mat-select [(ngModel)]="position">
            <mat-option value="before">Before</mat-option>
            <mat-option value="after">After</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div *ngFor="let column of columnDetails; let i = index" class="column-detail">
        <h4>Column {{i + 1}}</h4>
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Column Label</mat-label>
          <input matInput [(ngModel)]="column.label" placeholder="Enter column label">
        </mat-form-field>
        
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Column Type</mat-label>
          <mat-select [(ngModel)]="column.type">
            <mat-option value="text">Text</mat-option>
            <mat-option value="number">Number</mat-option>
            <mat-option value="email">Email</mat-option>
            <mat-option value="date">Date</mat-option>
          </mat-select>
        </mat-form-field>
        
        <mat-checkbox [(ngModel)]="column.sortable">Sortable</mat-checkbox>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="confirm()">Add Columns</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      padding-top: 24px !important;
    }
    .form-group {
      margin-bottom: 16px;
    }
    .column-detail {
      border: 1px solid #e0e0e0;
      padding: 16px;
      margin-bottom: 16px;
      border-radius: 4px;
    }
    .column-detail h4 {
      margin-top: 0;
      margin-bottom: 16px;
    }
    mat-checkbox {
      display: block;
      margin-top: 8px;
    }
  `]
})
export class InsertColumnDialogComponent implements OnInit {
  numberOfColumns = 1;
  position = 'after';
  columnDetails: any[] = [{ label: '', type: 'text', sortable: true }];

  constructor(
    public dialogRef: MatDialogRef<InsertColumnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { referenceColumn: string }
  ) {}

  ngOnInit() {
    this.updateColumnDetails();
  }

  updateColumnDetails() {
    this.columnDetails = [];
    for (let i = 0; i < this.numberOfColumns; i++) {
      this.columnDetails.push({ label: '', type: 'text', sortable: true });
    }
  }

  onNumberOfColumnsChange() {
    this.updateColumnDetails();
  }

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    this.dialogRef.close({
      numberOfColumns: this.numberOfColumns,
      position: this.position,
      columnDetails: this.columnDetails
    });
  }
} 