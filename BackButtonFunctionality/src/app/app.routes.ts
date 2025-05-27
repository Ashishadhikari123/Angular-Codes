import { Routes } from '@angular/router';
import { DateSelectorComponent } from './date-selector/date-selector.component';
import { DateDetailsComponent } from './date-details/date-details.component';

export const routes: Routes = [
  { path: '', component: DateSelectorComponent },
  { path: 'details', component: DateDetailsComponent }
];
