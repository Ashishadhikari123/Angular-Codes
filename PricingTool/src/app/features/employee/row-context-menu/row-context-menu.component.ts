import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../../../shared/material.module';

export interface RowContextMenuEvent {
  action: 'insertBefore' | 'insertAfter' | 'delete';
  rowIndex: number;
  rowData: any;
}

@Component({
  selector: 'app-row-context-menu',
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  template: `
    <div class="context-menu" 
         [style.left.px]="x" 
         [style.top.px]="y"
         [class.visible]="visible">
      <button mat-menu-item (click)="onAction('insertBefore')">
        <mat-icon>add_circle_outline</mat-icon>
        Insert Rows Before
      </button>
      <button mat-menu-item (click)="onAction('insertAfter')">
        <mat-icon>add_circle_outline</mat-icon>
        Insert Rows After
      </button>
      <mat-divider></mat-divider>
      <button mat-menu-item (click)="onAction('delete')" class="delete-action">
        <mat-icon>delete_outline</mat-icon>
        Delete Row
      </button>
    </div>
    <div class="context-menu-backdrop" 
         [class.visible]="visible" 
         (click)="close()">
    </div>
  `,
  styles: [`
    .context-menu {
      position: fixed;
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      min-width: 180px;
      opacity: 0;
      transform: scale(0.95);
      transition: opacity 0.15s ease, transform 0.15s ease;
      pointer-events: none;
    }
    
    .context-menu.visible {
      opacity: 1;
      transform: scale(1);
      pointer-events: auto;
    }
    
    .context-menu button {
      width: 100%;
      text-align: left;
      border: none;
      background: none;
      padding: 12px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
    }
    
    .context-menu button:hover {
      background-color: #f5f5f5;
    }
    
    .context-menu button.delete-action:hover {
      background-color: #ffebee;
      color: #d32f2f;
    }
    
    .context-menu button.delete-action mat-icon {
      color: #d32f2f;
    }
    
    .context-menu-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 999;
      opacity: 0;
      pointer-events: none;
    }
    
    .context-menu-backdrop.visible {
      pointer-events: auto;
    }
    
    mat-divider {
      margin: 4px 0;
    }
  `]
})
export class RowContextMenuComponent {
  @Input() visible = false;
  @Input() x = 0;
  @Input() y = 0;
  @Input() rowIndex = -1;
  @Input() rowData: any = null;
  
  @Output() contextMenuAction = new EventEmitter<RowContextMenuEvent>();
  @Output() contextMenuClose = new EventEmitter<void>();

  onAction(action: 'insertBefore' | 'insertAfter' | 'delete') {
    this.contextMenuAction.emit({
      action,
      rowIndex: this.rowIndex,
      rowData: this.rowData
    });
    this.close();
  }

  close() {
    this.contextMenuClose.emit();
  }
} 