import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { UserModule } from './user/user.module';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './user/login/login.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HttpService } from './http.service';
import { CookieService } from 'ngx-cookie-service';
import { ProductsListComponent } from './products/products-list/products-list.component';
import { ProductsModule } from './products/products.module';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    UserModule,
    ProductsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      { path: 'home', component: LoginComponent },
      { path: 'signup', component: SignUpComponent },
      { path: 'products/:userId', component:ProductsListComponent},
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent }
    ])
  ],
  providers: [HttpService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
