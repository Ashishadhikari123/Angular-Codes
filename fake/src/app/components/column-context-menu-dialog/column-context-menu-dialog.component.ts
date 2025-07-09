import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-column-context-menu-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="context-menu">
      <button mat-button (click)="add()" class="context-menu-item">
        <mat-icon>add</mat-icon>
        Add Column
      </button>
      <button mat-button (click)="delete()" class="context-menu-item delete">
        <mat-icon>delete</mat-icon>
        Delete Column
      </button>
    </div>
  `,
  styles: [`
    .context-menu {
      padding: 8px 0;
      min-width: 200px;
    }
    .context-menu-item {
      width: 100%;
      text-align: left;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .context-menu-item:hover {
      background-color: #f5f5f5;
    }
    .context-menu-item.delete {
      color: #d32f2f;
    }
    .context-menu-item.delete:hover {
      background-color: #ffebee;
    }
  `]
})
export class ColumnContextMenuDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ColumnContextMenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { columnKey: string; columnLabel: string }
  ) {}

  add() {
    this.dialogRef.close('add');
  }

  delete() {
    this.dialogRef.close('delete');
  }
} 