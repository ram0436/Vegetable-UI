import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminRoutingModule } from "./admin-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgFor } from "@angular/common";
import { AdminDashboardComponent } from "./component/admin-dashboard/admin-dashboard.component";
import { HttpClientModule } from "@angular/common/http";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatOptionModule } from "@angular/material/core";
import { MatChipsModule } from "@angular/material/chips";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatCheckboxModule } from "@angular/material/checkbox";
import {
  MatAutocomplete,
  MatAutocompleteModule,
} from "@angular/material/autocomplete";
import { SharedModule } from "src/codeokk/shared/shared.module";

@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [
    SharedModule,
    CommonModule,
    AdminRoutingModule,
    NgFor,
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
  ],
})
export class AdminModule {}
