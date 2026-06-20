import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { ExploreComponent } from './explore/explore.component';
import { DatabaseService } from 'src/app/shared/database.service'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExploreDetailsComponent } from './explore-details/explore-details.component';
import { WriteArticleComponent } from './write-article/write-article.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import myLocalePl from '@angular/common/locales/pl';
import { RegisterComponent } from './register/register.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { StartComponent } from './start/start.component';
import { ApplicationComponent } from './application/application.component';
import { ToastrModule } from 'ngx-toastr';
import { EditComponent } from './edit/edit.component';
import { EventEmitterService } from './event-emitter.service';
import { SettingsComponent } from './settings/settings.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ContactComponent } from './contact/contact.component';
registerLocaleData(myLocalePl);

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ExploreComponent,
    ExploreDetailsComponent,
    WriteArticleComponent,
    LoginComponent,
    RegisterComponent,
    StartComponent,
    ApplicationComponent,
    EditComponent,
    SettingsComponent,
    AdminPanelComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [DatabaseService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
    }, EventEmitterService],
  bootstrap: [AppComponent]
})
export class AppModule {
  
}
