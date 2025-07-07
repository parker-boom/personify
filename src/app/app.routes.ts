import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Select } from './pages/select/select';
import { Flow } from './pages/flow/flow';
import { Result } from './pages/result/result';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'select', component: Select },
  { path: 'flow', component: Flow },
  { path: 'result', component: Result },
];
