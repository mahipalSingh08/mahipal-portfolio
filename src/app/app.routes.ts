import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout';
import { ContactDashboardComponent } from './components/admin/contact-dashboard/contact-dashboard';
import { ReplyUserComponent } from './components/admin/reply-user/reply-user';
import { ConfigurationComponent } from './components/admin/configuration/configuration';
import { ReactionComponent } from './components/admin/reaction/reaction';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'contact-dashboard', component: ContactDashboardComponent, canActivate: [AuthGuard] },
      { path: 'reply-user', component: ReplyUserComponent, canActivate: [AuthGuard] },
      { path: 'configuration', component: ConfigurationComponent, canActivate: [AuthGuard] },
      { path: 'reaction', component: ReactionComponent, canActivate: [AuthGuard] }
    ]
  },
  { path: '**', redirectTo: '' }
];
