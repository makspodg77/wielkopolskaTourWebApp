import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component'
import { ExploreComponent } from './explore/explore.component'
import { ExploreDetailsComponent } from './explore-details/explore-details.component'
import { WriteArticleComponent } from './write-article/write-article.component'
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth/auth.guard';
import { StartComponent } from './start/start.component';
import { ApplicationComponent } from './application/application.component';
import { EditComponent } from './edit/edit.component';
import { SettingsComponent } from './settings/settings.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'app', component: ApplicationComponent, canActivate: [AuthGuard],
    children: [
      { path: 'explore', component: ExploreComponent, canActivate: [AuthGuard] },
      { path: 'explore/:id', component: ExploreDetailsComponent, canActivate: [AuthGuard] },
      { path: 'create', component: WriteArticleComponent, canActivate: [AuthGuard] },
      { path: 'main', component: MainComponent, canActivate: [AuthGuard] },
      { path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard] },
      { path: 'edit/:id', component: EditComponent, canActivate: [AuthGuard] },
      { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
      { path: 'contact', component: ContactComponent, canActivate: [AuthGuard] },
      { path: '', component: MainComponent, canActivate: [AuthGuard] }
    ]
  },
  {
    path: '', component: StartComponent,
    children: [
      { path: 'registration', component: RegisterComponent },
      { path: 'login', component: LoginComponent }
      ]
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
