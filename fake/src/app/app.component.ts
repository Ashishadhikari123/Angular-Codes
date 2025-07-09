import { Component } from '@angular/core';
import { UserTableComponent } from './components/user-table/user-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserTableComponent],
  template: `
    <app-user-table></app-user-table>
  `
})
export class AppComponent {
  // Clean app component - all logic moved to UserTableComponent
}