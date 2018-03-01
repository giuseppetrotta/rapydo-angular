import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes, UrlHandlingStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UpgradeModule }  from '@angular/upgrade/static';
import { downgradeInjectable } from '@angular/upgrade/static';
import { UpgradeAdapter } from '@angular/upgrade';

import { AppComponent } from './app.component';

import { appRoutes } from './app.routes';
import { appRoutes as customRoutes } from '/app/frontend/app/app.routes';
import { declarations as customDeclarations } from '/app/frontend/app/app.declarations';

import { ProfileComponent } from './app.profile';
import { NavbarComponent } from './app.navbar';
import { TestComponent } from './app.test';

import { AuthGuard } from './app.auth.guard';
import { AuthService } from './app.auth.service';
import { LoginComponent } from './login.component';
import { JwtInterceptor } from './jwt.interceptor';


export class HybridUrlHandlingStrategy implements UrlHandlingStrategy {
  
  shouldProcessUrl(url) {
    return url.toString().startsWith("/new");
  }
  extract(url) { return url; }
  merge(url, whole) { return url; }
}

var declarations = [
  AppComponent,
  LoginComponent,
  ProfileComponent,
  NavbarComponent,
  TestComponent
];

declarations.concat(customDeclarations);
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
    UpgradeModule
  ],
  declarations: declarations,
  bootstrap: [ AppComponent ],
  providers: [
    AuthService, AuthGuard,
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