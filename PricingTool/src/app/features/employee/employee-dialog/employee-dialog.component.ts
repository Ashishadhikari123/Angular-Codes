import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../../../shared/material.module';

@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  templateUrl: './employee-dialog.component.html',
  styleUrls: ['./employee-dialog.component.css']
})
export class EmployeeDialogComponent {
  form: FormGroup;
  columns: string[];

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<EmployeeDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.columns = data.columns;
    const group: any = {};
    this.columns.forEach(col => {
      group[col] = [''];
    });
    this.form = this.fb.group(group);
  }

  onSave() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  get columnPairs() {
    const pairs = [];
    for (let i = 0; i < this.columns.length; i += 2) {
      pairs.push([this.columns[i], this.columns[i + 1]]);
    }
    return pairs;
  }
} 