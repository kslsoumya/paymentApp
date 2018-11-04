import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsListComponent } from './products-list/products-list.component';
import { PaymentsComponent } from './payments/payments.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SuccessComponent } from './success/success.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { NgxSpinnerComponent, NgxSpinnerModule } from 'ngx-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    MatIconModule,
    NgxSpinnerModule,
    RouterModule.forChild([
      {path :'payments/:userId',component:PaymentsComponent},
      {path :'successPage',component:SuccessComponent},
      {path:'errorPage',component :ErrorPageComponent}
    ])
  ],
  declarations: [ProductsListComponent, PaymentsComponent, SuccessComponent, ErrorPageComponent]
})
export class ProductsModule { }
