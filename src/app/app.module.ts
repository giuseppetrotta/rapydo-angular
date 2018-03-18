import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes, UrlHandlingStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UpgradeModule }  from '@angular/upgrade/static';
import { downgradeInjectable } from '@angular/upgrade/static';
import { UpgradeAdapter } from '@angular/upgrade';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import { MomentModule } from 'angular2-moment/moment.module';

import { AppComponent } from './app.component';

import { appRoutes } from './app.routes';
import { appRoutes as customRoutes } from '/app/frontend/app/app.routes';
import { declarations as customDeclarations } from '/app/frontend/app/app.declarations';

import { IteratePipe } from './app.pipes'

import { ProfileComponent } from './app.profile';
import { Error404Component } from './app.error.404';
import { ChangePasswordComponent } from './app.profile.changepassword';
import { SessionsComponent } from './app.profile.sessions';

import { HomeComponent } from '/app/frontend/app/app.home';
import { NavbarComponent } from './app.navbar';

import { TestComponent } from './app.test';

import { AuthGuard } from './app.auth.guard';
import { AuthService } from './app.auth.service';
import { ApiService } from './api.service';
import { LoginComponent } from './login.component';
import { JwtInterceptor } from './jwt.interceptor';


export class HybridUrlHandlingStrategy implements UrlHandlingStrategy {
  
  shouldProcessUrl(url) {
    url = url.toString();

    if (url == '/') return true;
    if (url.toString().startsWith("/new")) return true;

    if (url.toString().startsWith("/app")) return false;

    console.log(url);

    return true;
  }
  extract(url) { return url; }
  merge(url, whole) { return url; }
}

var declarations = [
  AppComponent,
  LoginComponent,
  ProfileComponent, ChangePasswordComponent, SessionsComponent,
  HomeComponent, Error404Component,
  NavbarComponent,
  TestComponent,
  IteratePipe
];

declarations = declarations.concat(customDeclarations);
appRoutes.concat(customRoutes);

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false} // <-- debugging purposes only
    ),
    BrowserModule,
    FormsModule,
    // import HttpClientModule after BrowserModule
    HttpClientModule,
    NgbModule.forRoot(),
    MomentModule,
    UpgradeModule
  ],
  declarations: declarations,
  bootstrap: [ AppComponent ],
  providers: [
    AuthService, AuthGuard, ApiService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    { provide: UrlHandlingStrategy, useClass: HybridUrlHandlingStrategy}
  ]
})
export class AppModule {

}

export const upgradeAdapter = new UpgradeAdapter(AppModule);

upgradeAdapter.upgradeNg1Provider('$rootScope');

import * as angular from "angular";
angular.module('web').factory("AuthService2", downgradeInjectable(AuthService) as any)
angular.module('web').factory("ApiService2", downgradeInjectable(ApiService) as any)