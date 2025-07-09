import { Component, OnInit, inject, Inject, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { InsertDialogComponent } from '../insert-user-dialog/insert-dialog.component';
import { EditDialogComponent } from '../edit-user-dialog/edit-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ColumnContextMenuDialogComponent } from '../column-context-menu-dialog/column-context-menu-dialog.component';
import { InsertColumnDialogComponent } from '../insert-column-dialog/insert-column-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';

// interface User {
//   id: number;
//   name: string;
//   experience: number;
//   salary: number;
//   company: string;
//   location: string;
//   address: string;
// }



@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatSortModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    InsertDialogComponent,
    EditDialogComponent,
    ConfirmDialogComponent,
    ColumnContextMenuDialogComponent,
    InsertColumnDialogComponent
  ],
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  
  // Default columns
  displayedColumns = [
    'employee_id', 'name', 'experience', 'salary', 'company', 'location', 'address', 
    'email', 'phone', 'designation', 'department', 'dateOfJoining', 'employeeType', 
    'manager', 'nationality', 'dob', 'gender', 'maritalStatus', 'bloodGroup', 'employeeCode'
  ];
  
  // Company options for dropdown
  companyOptions = [
    'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Tesla', 'IBM', 
    'Oracle', 'Salesforce', 'Adobe', 'Intel', 'Cisco', 'NVIDIA', 'AMD', 'Dell',
    'HP', 'Lenovo', 'Samsung', 'Sony', 'LG', 'Panasonic', 'Philips', 'Siemens',
    'GE', 'Boeing', 'Airbus', 'Toyota', 'Honda', 'Ford', 'GM', 'BMW', 'Mercedes',
    'Volkswagen', 'Audi', 'Porsche', 'Ferrari', 'Lamborghini', 'McLaren', 'Aston Martin'
  ];
  
  // Column configuration for dynamic columns
  columnConfig: { [key: string]: { label: string; type: string; sortable: boolean } } = {
    'employee_id': { label: 'Employee ID', type: 'text', sortable: true },
    'name': { label: 'Name', type: 'text', sortable: true },
    'experience': { label: 'Experience', type: 'number', sortable: true },
    'salary': { label: 'Salary', type: 'number', sortable: true },
    'company': { label: 'Company', type: 'dropdown', sortable: true },
    'location': { label: 'Location', type: 'text', sortable: true },
    'address': { label: 'Address', type: 'text', sortable: true },
    'email': { label: 'Email', type: 'email', sortable: true },
    'phone': { label: 'Phone', type: 'text', sortable: true },
    'designation': { label: 'Designation', type: 'text', sortable: true },
    'department': { label: 'Department', type: 'text', sortable: true },
    'dateOfJoining': { label: 'Date of Joining', type: 'date', sortable: true },
    'employeeType': { label: 'Employee Type', type: 'text', sortable: true },
    'manager': { label: 'Manager', type: 'text', sortable: true },
    'employeeCode': { label: 'Employee Code', type: 'text', sortable: true },
    'nationality': { label: 'Nationality', type: 'text', sortable: true },
    'dob': { label: 'Date of Birth', type: 'date', sortable: true },
    'gender': { label: 'Gender', type: 'text', sortable: true },
    'maritalStatus': { label: 'Marital Status', type: 'text', sortable: true },
    'bloodGroup': { label: 'Blood Group', type: 'text', sortable: true }
  };
  dataSource = new MatTableDataSource<User>([]);

  private http = inject(HttpClient);
  private dialog = inject(MatDialog);

  // Inline editing properties
  editingCell: { rowIndex: number; column: string } | null = null;
  editingValue: any = '';

  ngOnInit(): void {
    this.loadUsers();
    this.loadColumnConfiguration();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'experience':
          return item.experience || 0;
        case 'name':
          return item.name || '';
        default:
          return item[property as keyof User] || '';
      }
    };
  }

  loadUsers(): void {
    this.http.get<User[]>('http://localhost:3000/users').subscribe(data => {
      this.dataSource.data = data;
      // Validate uniqueness of existing data
      this.validateUniqueEmployeeIds();
      // Load any additional column data from localStorage
      this.loadColumnData();
    });
  }

  // Load column configuration from localStorage
  private loadColumnConfiguration(): void {
    const savedColumns = localStorage.getItem('userTableDisplayedColumns');
    const savedConfig = localStorage.getItem('userTableColumnConfig');
    
    if (savedColumns) {
      this.displayedColumns = JSON.parse(savedColumns);
    }
    
    if (savedConfig) {
      this.columnConfig = { ...this.columnConfig, ...JSON.parse(savedConfig) };
    }
  }

  // Save column configuration to localStorage
  private saveColumnConfiguration(): void {
    localStorage.setItem('userTableDisplayedColumns', JSON.stringify(this.displayedColumns));
    localStorage.setItem('userTableColumnConfig', JSON.stringify(this.columnConfig));
  }

  // Load column data from localStorage for dynamic columns
  private loadColumnData(): void {
    const savedData = localStorage.getItem('userTableData');
    if (savedData) {
      const savedUsers = JSON.parse(savedData);
      // Merge saved data with current data, preserving dynamic columns
      this.dataSource.data = this.dataSource.data.map(user => {
        const savedUser = savedUsers.find((saved: any) => saved.id === user.id);
        if (savedUser) {
          return { ...user, ...savedUser };
        }
        return user;
      });
    }
  }

  // Save column data to localStorage
  private saveColumnData(): void {
    localStorage.setItem('userTableData', JSON.stringify(this.dataSource.data));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onRowRightClick(event: Event, index: number) {
    event.preventDefault(); // Prevent default context menu
    
    const user = this.dataSource.data[index];
    this.showContextMenu(event, index, user); // opens the context menu for the row when right clicked
  }

  showContextMenu(event: Event, index: number, user: User) {
    const contextMenuDialog = this.dialog.open(ContextMenuDialogComponent, {
      width: '250px',
      height: '100px',
      position: { 
        left: (event as MouseEvent).clientX + 'px', 
        top: (event as MouseEvent).clientY + 'px' 
      },
      data: { user }
    });

    contextMenuDialog.afterClosed().subscribe(result => {
      if (result === 'insert') {
        this.showInsertDialog(index);
      } else if (result === 'delete') {
        this.showDeleteConfirmation(user);
      }
    });
  }

  showInsertDialog(index: number) {
    const dialogRef = this.dialog.open(InsertDialogComponent, {
      width: '300px',
      data: { index: index }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const insertIndex = result.position === 'above' ? index : index + 1;
        this.insertRowsAt(insertIndex, result.numberOfRows);
      }
    });
  }

  showDeleteConfirmation(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { 
        message: `Are you sure you want to delete ${user.name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.deleteUser(user);
      }
    });
  }

  // Inline editing methods
  onCellClick(rowIndex: number, column: string, value: any) {
    // Don't allow editing ID column or employee_id column (auto-generated)
    if (column === 'id' || column === 'employee_id') return;
    
    this.editingCell = { rowIndex, column };
    this.editingValue = value;
  }

  // Handle dropdown selection for company column
  onCompanySelect(rowIndex: number, selectedCompany: string) {
    const user = this.dataSource.data[rowIndex];
    user.company = selectedCompany;
    this.dataSource.data = [...this.dataSource.data];
    this.saveColumnData();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Use setTimeout to ensure this runs after the cell click event
    setTimeout(() => {
      // Check if click is outside the editing cell
      if (this.editingCell) {
        const target = event.target as HTMLElement;
        const isEditingInput = target.closest('.cell-input');
        const isEditingCell = target.closest('.mat-mdc-cell.editing');
        const isTableCell = target.closest('.mat-mdc-cell');
        
        // If click is not on the editing input, editing cell, or any table cell, save and stop editing
        if (!isEditingInput && !isEditingCell && !isTableCell) {
          this.saveCellEdit();
        }
      }
    }, 0);
  }

  onCellBlur() {
    if (this.editingCell) {
      this.saveCellEdit();
    }
  }

  onCellKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.saveCellEdit();
    } else if (event.key === 'Escape') {
      this.cancelCellEdit();
    }
  }

  saveCellEdit() {
    if (this.editingCell) {
      const { rowIndex, column } = this.editingCell;
      const user = this.dataSource.data[rowIndex];
      
      // Convert value based on column type
      let newValue: any = this.editingValue;
      if (column === 'experience' || column === 'salary') {
        newValue = Number(this.editingValue);
        if (isNaN(newValue)) {
          newValue = 0;
        }
      }

      // Update the user object
      (user as any)[column] = newValue;
      
      // Update the data source
      this.dataSource.data = [...this.dataSource.data];
      
      this.editingCell = null;
      this.editingValue = '';
    }
  }

  cancelCellEdit() {
    this.editingCell = null;
    this.editingValue = '';
  }

  isEditing(rowIndex: number, column: string): boolean {
    return this.editingCell?.rowIndex === rowIndex && this.editingCell?.column === column;
  }

  updateUser(updatedUser: User) {
    const currentData = [...this.dataSource.data];
    const index = currentData.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      currentData[index] = updatedUser;
      this.dataSource.data = currentData;
    }
  }

  deleteUser(userToDelete: User) {
    const currentData = [...this.dataSource.data];
    const index = currentData.findIndex(user => user.id === userToDelete.id);
    if (index !== -1) {
      currentData.splice(index, 1);
      this.dataSource.data = currentData;
    }
  }

  // Generate unique Employee ID
  private generateUniqueEmployeeId(): string {
    // Get all existing Employee IDs from the current data source
    const existingIds = this.dataSource.data
      .map(user => user.employee_id)
      .filter(id => id && id.startsWith('EMPID'))
      .map(id => {
        const numberPart = id.substring(4); // Remove 'EMPID' prefix
        return parseInt(numberPart, 10);
      })
      .filter(num => !isNaN(num));

    let nextNumber = 1;
    if (existingIds.length > 0) {
      nextNumber = Math.max(...existingIds) + 1;
    }

    // Format as EMPIDXXXX (4-digit number with leading zeros)
    return `EMPID${nextNumber.toString().padStart(4, '0')}`;
  }

  // Generate multiple unique Employee IDs
  private generateMultipleUniqueEmployeeIds(count: number): string[] {
    const ids: string[] = [];
    // Gather all existing Employee IDs into a Set for fast lookup
    const existingIdsSet = new Set(
      this.dataSource.data
        .map(user => user.employee_id)
        .filter(id => id && id.startsWith('EMPID'))
    );

    let nextNumber = 1;
    while (ids.length < count) {
      const candidate = `EMPID${nextNumber.toString().padStart(4, '0')}`;
      if (!existingIdsSet.has(candidate) && !ids.includes(candidate)) {
        ids.push(candidate);
      }
      nextNumber++;
    }

    return ids;
  }

  // Validate that all Employee IDs are unique
  private validateUniqueEmployeeIds(): boolean {
    const allEmployeeIds = this.dataSource.data.map(user => user.employee_id);
    const uniqueIds = new Set(allEmployeeIds);
    const hasDuplicates = allEmployeeIds.length !== uniqueIds.size;
    
    if (hasDuplicates) {
      console.error('Duplicate Employee IDs found!');
      const duplicates = allEmployeeIds.filter((id, index) => allEmployeeIds.indexOf(id) !== index);
      console.error('Duplicate IDs:', duplicates);
    }
    
    return !hasDuplicates;
  }

  insertRowsAt(index: number, count: number) {
    // Generate all unique Employee IDs at once
    const uniqueEmployeeIds = this.generateMultipleUniqueEmployeeIds(count);
    
    const newRows: User[] = [];

    for (let i = 0; i < count; i++) {
      newRows.push({
        id: Date.now() + i,
        employee_id: uniqueEmployeeIds[i],
        name: '',
        experience: null as any,
        salary: null as any,
        company: '',
        location: '',
        address: '',
        email: '',
        phone: '',
        designation: '',
        department: '',
        dateOfJoining: '',
        employeeType: '',
        manager: '',
        employeeCode: '',
        nationality: '',
        dob: '',
        gender: '',
        maritalStatus: '',
        bloodGroup: ''
      });
    }

    const currentData = [...this.dataSource.data];
    currentData.splice(index, 0, ...newRows);
    this.dataSource.data = currentData;
    // Validate uniqueness after insertion
    this.validateUniqueEmployeeIds();
  }

  // Column management methods, when right click on the column header, show the context menu
  onColumnHeaderRightClick(event: Event, columnKey: string) {
    event.preventDefault(); 
    event.stopPropagation(); 
    
    // Don't allow deletion of essential columns
    if (columnKey === 'employee_id') {
      return;
    }
    
    this.showColumnContextMenu(event, columnKey);
  }

  showColumnContextMenu(event: Event, columnKey: string) {
    const contextMenuDialog = this.dialog.open(ColumnContextMenuDialogComponent, {
      width: '250px',
      position: { 
        left: (event as MouseEvent).clientX + 'px', 
        top: (event as MouseEvent).clientY + 'px' 
      },
      data: { columnKey, columnLabel: this.columnConfig[columnKey]?.label || columnKey }
    });

    contextMenuDialog.afterClosed().subscribe(result => {
      if (result === 'add') {
        this.showSimpleInsertColumnDialog(columnKey);
      } else if (result === 'delete') {
        this.showDeleteColumnConfirmation(columnKey);
      }
    });
  }

  showSimpleInsertColumnDialog(referenceColumn: string) {
    const dialogRef = this.dialog.open(SimpleInsertColumnDialogComponent, {
      width: '300px',
      data: { referenceColumn }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const insertIndex = result.position === 'before' ? 
          this.displayedColumns.indexOf(referenceColumn) : 
          this.displayedColumns.indexOf(referenceColumn) + 1;
        
        // Generate simple column details with default values
        const columnDetails = [];
        for (let i = 0; i < result.numberOfColumns; i++) {
          columnDetails.push({
            label: `Column ${i + 1}`,
            type: 'text',
            sortable: true
          });
        }
        
        this.insertColumnsAt(insertIndex, result.numberOfColumns, columnDetails);
      }
    });
  }

  showDeleteColumnConfirmation(columnKey: string) {
    const columnLabel = this.columnConfig[columnKey]?.label || columnKey;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { 
        message: `Are you sure you want to delete the column "${columnLabel}"? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.deleteColumn(columnKey);
      }
    });
  }

  insertColumnsAt(index: number, count: number, columnDetails: any[]) {
    const newColumns: string[] = [];
    for (let i = 0; i < count; i++) {
      const columnKey = `dynamic_${Date.now()}_${i}`;
      const detail = columnDetails[i] || {};
      
      // Add to displayed columns
      newColumns.push(columnKey);
      
      // Add to column configuration
      this.columnConfig[columnKey] = {
        label: detail.label || `Column ${i + 1}`,
        type: detail.type || 'text',
        sortable: detail.sortable !== false
      };
      
      // Add empty values to all existing rows
      this.dataSource.data.forEach(user => {
        (user as any)[columnKey] = '';
      });
    }

    // Insert columns at the specified index
    this.displayedColumns.splice(index, 0, ...newColumns);
    
    // Save configuration to localStorage
    this.saveColumnConfiguration();
    
    // Save data to localStorage
    this.saveColumnData();
    
    // Update the data source to trigger re-render
    this.dataSource.data = [...this.dataSource.data];
  }

  deleteColumn(columnKey: string) {
    // Remove from displayed columns
    const columnIndex = this.displayedColumns.indexOf(columnKey);
    if (columnIndex > -1) {
      this.displayedColumns.splice(columnIndex, 1);
    }
    
    // Remove from column configuration
    delete this.columnConfig[columnKey];
    
    // Remove the property from all user objects
    this.dataSource.data.forEach(user => {
      delete (user as any)[columnKey];
    });
    
    // Save configuration to localStorage
    this.saveColumnConfiguration();
    
    // Save data to localStorage
    this.saveColumnData();
    
    // Update the data source to trigger re-render
    this.dataSource.data = [...this.dataSource.data];
  }

  getColumnLabel(columnKey: string): string {
    return this.columnConfig[columnKey]?.label || columnKey;
  }

  getColumnType(columnKey: string): string {
    return this.columnConfig[columnKey]?.type || 'text';
  }

  isColumnSortable(columnKey: string): boolean {
    return this.columnConfig[columnKey]?.sortable !== false;
  }

  isSortableColumn(column: string): boolean {
    // Always sortable for these three
    if (column === 'employee_id' || column === 'name' || column === 'experience') return true;
    // Only sortable for dynamic columns if their config says so and not a default non-sortable
    return this.columnConfig[column]?.sortable === true && !this.isDefaultNonSortableColumn(column);
  }

  isDefaultNonSortableColumn(column: string): boolean {
    // List all your default columns that should never be sortable except the three above
    const nonSortableDefaults = [
      'salary', 'company', 'location', 'address', 'email', 'phone', 'designation',
      'department', 'dateOfJoining', 'employeeType', 'manager', 'employeeCode',
      'nationality', 'dob', 'gender', 'maritalStatus', 'bloodGroup'
    ];
    return nonSortableDefaults.includes(column);
  }
}

// Context Menu Dialog Component
@Component({
  selector: 'app-context-menu-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="context-menu">
      <button mat-button (click)="insert()" class="context-menu-item">
        <mat-icon>add</mat-icon>
        Insert Row
      </button>
      <button mat-button (click)="delete()" class="context-menu-item delete">
        <mat-icon>delete</mat-icon>
        Delete Row
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
export class ContextMenuDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ContextMenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {}

  insert() {
    this.dialogRef.close('insert');
  }

  delete() {
    this.dialogRef.close('delete');
  }
}

// Simple Insert Column Dialog Component
@Component({
  selector: 'app-simple-insert-column-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title>Add Column</h2>
    <mat-dialog-content>
      <div class="form-group">
        <mat-form-field appearance="outline" style="width: 100%;" floatLabel="always">
          <mat-label>Number of Columns</mat-label>
          <input matInput type="number" [(ngModel)]="numberOfColumns" min="1" max="10">
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
  `]
})
export class SimpleInsertColumnDialogComponent {
  numberOfColumns = 1;
  position = 'after';

  constructor(
    public dialogRef: MatDialogRef<SimpleInsertColumnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { referenceColumn: string }
  ) {}

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    this.dialogRef.close({
      numberOfColumns: this.numberOfColumns,
      position: this.position
    });
  }
}

 