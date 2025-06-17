import { Component } from '@angular/core';
import { StudentTableComponent } from './components/student-table/student-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StudentTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'myAngular';
}
