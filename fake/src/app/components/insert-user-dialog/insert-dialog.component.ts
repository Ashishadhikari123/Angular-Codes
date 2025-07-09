import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-insert-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule
  ],
  templateUrl: './insert-dialog.component.html',
  styleUrls: ['./insert-dialog.component.css']
})
export class InsertDialogComponent {
  position: 'above' | 'below' = 'below';
  numberOfRows = 1;

  constructor(
    public dialogRef: MatDialogRef<InsertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirm() {
    this.dialogRef.close({
      position: this.position,
      numberOfRows: this.numberOfRows
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
