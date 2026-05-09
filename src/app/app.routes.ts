import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout';
import { ContactDashboardComponent } from './components/admin/contact-dashboard/contact-dashboard';
import { ReplyUserComponent } from './components/admin/reply-user/reply-user';
import { ConfigurationComponent } from './components/admin/configuration/configuration';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'admin', 
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'contact-dashboard', pathMatch: 'full' },
      { path: 'contact-dashboard', component: ContactDashboardComponent },
      { path: 'reply-user', component: ReplyUserComponent },
      { path: 'configuration', component: ConfigurationComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
