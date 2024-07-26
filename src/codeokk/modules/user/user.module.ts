import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { LoginComponent } from "./component/login/login.component";
import { SignupComponent } from "./component/signup/signup.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AccountComponent } from "./component/account/account.component";
import { UserRoutingModule } from "./user-routing.module";
import { MatOptionModule } from "@angular/material/core";
import { MatChipsModule } from "@angular/material/chips";
import { MatSelectModule } from "@angular/material/select";
import { SharedModule } from "src/codeokk/shared/shared.module";
import { WishlistComponent } from "./component/wishlist/wishlist.component";
import { CartComponent } from "./component/cart/cart.component";
import { AddressComponent } from "./component/address/address.component";
import { OrdersComponent } from "./component/orders/orders.component";
import { PaymentComponent } from "./component/payment/payment.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    AccountComponent,
    WishlistComponent,
    CartComponent,
    AddressComponent,
    OrdersComponent,
    PaymentComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    HttpClientModule,
    MatFormFieldModule,
    FormsModule,
    MatCardModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    UserRoutingModule,
    MatOptionModule,
    MatChipsModule,
    CommonModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    HttpClientModule,
    MatFormFieldModule,
    MatChipsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
})
export class UserModule {}
