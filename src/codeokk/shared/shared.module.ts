import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./component/header/header.component";
import { FooterComponent } from "./component/footer/footer.component";
import { Router, RouterModule } from "@angular/router";
import { PostCardsComponent } from "./component/post-cards/post-cards.component";
import { SharedOrdersComponent } from "./component/shared-orders/shared-orders.component";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { HttpClientModule } from "@angular/common/http";
import { MatFormFieldModule } from "@angular/material/form-field";
import { StarRatingComponent } from "./component/star-rating/star-rating.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTabsModule } from "@angular/material/tabs";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatChipsModule } from "@angular/material/chips";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatCheckboxModule } from "@angular/material/checkbox";
import {
  MatAutocomplete,
  MatAutocompleteModule,
} from "@angular/material/autocomplete";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    PostCardsComponent,
    SharedOrdersComponent,
    StarRatingComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatOptionModule,
    MatChipsModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    HttpClientModule,
    MatFormFieldModule,
    MatChipsModule,
    MatSelectModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    PostCardsComponent,
    SharedOrdersComponent,
    StarRatingComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
