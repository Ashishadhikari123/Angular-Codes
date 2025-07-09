import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-title">
        <mat-icon color="warn">warning</mat-icon>
        Confirm Delete
      </div>
      <div class="dialog-message">
        {{ data.message }}
      </div>
      <div class="dialog-actions">
        <button mat-stroked-button (click)="cancel()">Cancel</button>
        <button mat-raised-button color="warn" (click)="confirm()">Delete</button>
      </div>
    </div>
  `,
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  confirm() {
    this.dialogRef.close('confirm');
  }

  cancel() {
    this.dialogRef.close(null);
  }
} 