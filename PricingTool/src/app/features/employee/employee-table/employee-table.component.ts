import { Component, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { EmployeeService } from '../../../core/employee.service';
import { Employee } from '../../../models/employee.model';
import { EmployeeDialogComponent } from '../employee-dialog/employee-dialog.component';
import { BulkRowDialogComponent, BulkRowDialogData, BulkRowDialogResult } from '../bulk-row-dialog/bulk-row-dialog.component';
import { RowContextMenuComponent, RowContextMenuEvent } from '../row-context-menu/row-context-menu.component';
import { MATERIAL_MODULES } from '../../../shared/material.module';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatPaginatorModule, ...MATERIAL_MODULES, EmployeeDialogComponent, BulkRowDialogComponent, RowContextMenuComponent],
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.css']
})
export class EmployeeTableComponent implements OnInit, AfterViewInit {
  private employeeService = inject(EmployeeService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = [];

  dataSource = new MatTableDataSource<Employee>([]);
  searchValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Context menu properties
  contextMenuVisible = false;
  contextMenuX = 0;
  contextMenuY = 0;
  contextMenuRowIndex = -1;
  contextMenuRowData: any = null;

  ngOnInit() {
    this.employeeService.getColumns().subscribe(cols => {
      this.displayedColumns = cols;
      this.loadEmployees();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe(data => {
      console.log('Loading employees:', data.length);
      this.dataSource.data = [...data];
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  refreshEmployees() {
    console.log('Refreshing employees from API...');
    this.employeeService.refreshEmployees().subscribe(data => {
      console.log('Refreshed employees:', data.length);
      this.dataSource.data = [...data];
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      data: {
        columns: this.displayedColumns
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.addEmployee(result).subscribe(() => {
          this.loadEmployees();
        });
      }
    });
  }

  addRow() {
    this.openAddDialog();
  }

  addColumn() {
    const columnName = prompt('Enter new column name:');
    if (columnName && !this.displayedColumns.includes(columnName)) {
      this.displayedColumns.push(columnName);
      this.employeeService.updateColumns(this.displayedColumns).subscribe();
    }
  }

  // Bulk row insertion methods
  openBulkRowDialog(selectedRowIndex?: number, selectedRowData?: any) {
    const dialogData: BulkRowDialogData = {
      totalRows: this.dataSource.data.length,
      selectedRowIndex,
      selectedRowData
    };

    const dialogRef = this.dialog.open(BulkRowDialogComponent, {
      data: dialogData,
      width: '500px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((result: BulkRowDialogResult) => {
      if (result) {
        this.insertRows(result);
      }
    });
  }

  insertRows(result: BulkRowDialogResult) {
    console.log('=== INSERTING ROWS ===');
    console.log('Result:', result);
    
    // Create empty rows with unique IDs
    const emptyRows: Employee[] = Array(result.numberOfRows).fill(null).map((_, index) => ({
      id: Date.now() + index, // Temporary unique ID
      name: `Empty Row ${index + 1}`, // Give them a name for debugging
      experience: 0,
      salary: 0,
      company: '',
      location: '',
      address: ''
    }));
    
    console.log('Empty rows to insert:', emptyRows.length);
    console.log('Current data source length:', this.dataSource.data.length);
    
    // Get current data
    const currentData = [...this.dataSource.data];
    console.log('Current data names:', currentData.map(e => e.name));
    
    let newData: Employee[] = [];
    
    // Perform insertion based on position
    switch (result.insertPosition) {
      case 'top':
        newData = [...emptyRows, ...currentData];
        console.log('Inserting at TOP');
        break;
        
      case 'bottom':
        newData = [...currentData, ...emptyRows];
        console.log('Inserting at BOTTOM');
        break;
        
      case 'before':
        if (result.targetIndex !== undefined && result.targetIndex >= 0) {
          console.log('Inserting BEFORE index:', result.targetIndex);
          console.log('Target row name:', currentData[result.targetIndex]?.name);
          console.log('Slice 1 (0 to targetIndex):', currentData.slice(0, result.targetIndex).map(e => e.name));
          console.log('Slice 2 (targetIndex to end):', currentData.slice(result.targetIndex).map(e => e.name));
          newData = [
            ...currentData.slice(0, result.targetIndex),
            ...emptyRows,
            ...currentData.slice(result.targetIndex)
          ];
        } else {
          console.log('Invalid targetIndex for BEFORE, defaulting to TOP');
          newData = [...emptyRows, ...currentData];
        }
        break;
        
      case 'after':
        if (result.targetIndex !== undefined && result.targetIndex >= 0) {
          console.log('Inserting AFTER index:', result.targetIndex);
          console.log('Target row name:', currentData[result.targetIndex]?.name);
          console.log('Slice 1 (0 to targetIndex+1):', currentData.slice(0, result.targetIndex + 1).map(e => e.name));
          console.log('Slice 2 (targetIndex+1 to end):', currentData.slice(result.targetIndex + 1).map(e => e.name));
          newData = [
            ...currentData.slice(0, result.targetIndex + 1),
            ...emptyRows,
            ...currentData.slice(result.targetIndex + 1)
          ];
        } else {
          console.log('Invalid targetIndex for AFTER, defaulting to BOTTOM');
          newData = [...currentData, ...emptyRows];
        }
        break;
    }
    
    console.log('New data length:', newData.length);
    console.log('New data names:', newData.map(e => e.name));
    
    // Update data source directly
    this.dataSource.data = newData;
    
    // Force change detection
    this.dataSource._updateChangeSubscription();
    
    // Navigate to the page containing the newly inserted rows
    if (this.paginator && result.targetIndex !== undefined) {
      this.navigateToInsertedRows(result);
    }
    
    console.log('=== INSERTION COMPLETE ===');
  }

  // Context menu methods
  public getAbsoluteIndex(i: number): number {
    const pageIndex = this.paginator ? this.paginator.pageIndex : 0;
    const pageSize = this.paginator ? this.paginator.pageSize : this.dataSource.data.length;
    const absoluteIndex = (pageIndex * pageSize) + i;
    console.log('[getAbsoluteIndex] i:', i, 'pageIndex:', pageIndex, 'pageSize:', pageSize, 'absoluteIndex:', absoluteIndex);
    return absoluteIndex;
  }

  onRowRightClick(event: MouseEvent, absoluteIndex: number, rowData: any) {
    console.log('[onRowRightClick] absoluteIndex:', absoluteIndex, 'rowData:', rowData);
    event.preventDefault();
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
    this.contextMenuRowIndex = absoluteIndex;
    this.contextMenuRowData = rowData;
    this.contextMenuVisible = true;
  }

  onContextMenuAction(event: RowContextMenuEvent) {
    switch (event.action) {
      case 'insertBefore':
        this.openBulkRowDialogForPosition(this.contextMenuRowIndex, this.contextMenuRowData, 'before');
        break;
      case 'insertAfter':
        this.openBulkRowDialogForPosition(this.contextMenuRowIndex, this.contextMenuRowData, 'after');
        break;
      case 'delete':
        this.deleteRow(this.contextMenuRowIndex, this.contextMenuRowData);
        break;
    }
  }

  openBulkRowDialogForPosition(rowIndex: number, rowData: any, defaultPosition: 'before' | 'after') {
    const numericRowIndex = Number(rowIndex);
    const dialogData: BulkRowDialogData & { defaultPosition?: 'before' | 'after' | 'top' | 'bottom' } = {
      totalRows: this.dataSource.data.length,
      selectedRowIndex: numericRowIndex,
      selectedRowData: rowData,
      defaultPosition
    };
    const dialogRef = this.dialog.open(BulkRowDialogComponent, {
      data: dialogData,
      width: '500px',
      disableClose: false
    });
    dialogRef.afterClosed().subscribe((result: BulkRowDialogResult) => {
      if (result) {
        const finalResult: BulkRowDialogResult = {
          numberOfRows: result.numberOfRows,
          insertPosition: result.insertPosition, // use the dialog's value
          targetIndex: numericRowIndex
        };
        this.insertRows(finalResult);
      }
    });
  }

  onContextMenuClose() {
    this.contextMenuVisible = false;
  }

  deleteRow(rowIndex: number, rowData: any) {
    if (confirm('Are you sure you want to delete this row?')) {
      if (rowData.id) {
        this.employeeService.deleteEmployee(rowData.id).subscribe(() => {
          this.loadEmployees();
        });
      } else {
        // For rows without ID (newly inserted empty rows)
        const currentData = [...this.dataSource.data];
        currentData.splice(rowIndex, 1);
        this.dataSource.data = currentData;
        this.dataSource._updateChangeSubscription();
      }
    }
  }

  // Quick insert methods for toolbar buttons
  insertRowsAtTop() {
    const result: BulkRowDialogResult = {
      numberOfRows: 1,
      insertPosition: 'top'
    };
    this.insertRows(result);
  }

  insertRowsAtBottom() {
    const result: BulkRowDialogResult = {
      numberOfRows: 1,
      insertPosition: 'bottom'
    };
    this.insertRows(result);
  }

  insertMultipleRows() {
    this.openBulkRowDialog();
  }

  navigateToInsertedRows(result: BulkRowDialogResult) {
    if (!this.paginator || !result.targetIndex) return;
    
    let insertionIndex = result.targetIndex;
    
    // Adjust insertion index based on position
    if (result.insertPosition === 'after') {
      insertionIndex = result.targetIndex + 1;
    } else if (result.insertPosition === 'top') {
      insertionIndex = 0;
    } else if (result.insertPosition === 'bottom') {
      insertionIndex = this.dataSource.data.length - result.numberOfRows;
    }
    
    // Calculate which page the inserted rows are on
    const pageSize = this.paginator.pageSize;
    const targetPage = Math.floor(insertionIndex / pageSize);
    
    console.log('Navigating to page:', targetPage, 'for insertion index:', insertionIndex);
    
    // Navigate to the page containing the inserted rows
    this.paginator.pageIndex = targetPage;
    this.dataSource.paginator = this.paginator;
  }

  testInsertion() {
    console.log('=== RUNNING INSERTION TEST ===');
    this.employeeService.testInsertionLogic();
  }

  debugCurrentData() {
    console.log('=== CURRENT DATA DEBUG ===');
    console.log('Total rows:', this.dataSource.data.length);
    console.log('Current page:', this.paginator ? this.paginator.pageIndex : 0);
    console.log('Page size:', this.paginator ? this.paginator.pageSize : this.dataSource.data.length);
    console.log('All data:', this.dataSource.data.map((e, i) => ({ index: i, name: e.name, id: e.id })));
  }

  testInsertAfterAlice() {
    console.log('=== TESTING INSERT AFTER ALICE ===');
    
    // Find Alice's index
    const aliceIndex = this.dataSource.data.findIndex(e => e.name === 'Alice');
    console.log('Alice found at index:', aliceIndex);
    
    if (aliceIndex !== -1) {
      const result: BulkRowDialogResult = {
        numberOfRows: 3,
        insertPosition: 'after',
        targetIndex: aliceIndex
      };
      
      console.log('Inserting 3 rows after Alice at index:', aliceIndex);
      this.insertRows(result);
    } else {
      console.log('Alice not found in data!');
    }
  }

  testInsertBeforeBob() {
    console.log('=== TESTING INSERT BEFORE BOB ===');
    
    // Find Bob's index
    const bobIndex = this.dataSource.data.findIndex(e => e.name === 'Bob');
    console.log('Bob found at index:', bobIndex);
    
    if (bobIndex !== -1) {
      const result: BulkRowDialogResult = {
        numberOfRows: 2,
        insertPosition: 'before',
        targetIndex: bobIndex
      };
      
      console.log('Inserting 2 rows before Bob at index:', bobIndex);
      this.insertRows(result);
    } else {
      console.log('Bob not found in data!');
    }
  }
} 