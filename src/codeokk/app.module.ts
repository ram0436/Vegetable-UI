import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { forwardRef, NgModule } from "@angular/core";
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "src/codeokk/shared/shared.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FiltersComponent } from "./modules/filters/filters.component";
import { PostMenuComponent } from "./modules/post-menu/post-menu.component";
import { HomeComponent } from "./modules/home/home.component";
import { FilteredPostsComponent } from "./modules/filtered-posts/filtered-posts.component";
import { ProductDetailsComponent } from "./modules/product-details/product-details.component";
import { HttpClientModule } from "@angular/common/http";
import { MatTabsModule } from "@angular/material/tabs";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { AdminModule } from "./modules/admin/admin.module";
import { MatDialogModule } from "@angular/material/dialog";
import { JwtInterceptor } from "./modules/auth/interceptor/JwtInterceptor";
import { TryAtHomeComponent } from "./modules/try-at-home/try-at-home.component";
import { ArViewComponent } from "./modules/ar-view/ar-view.component";

@NgModule({
  declarations: [
    AppComponent,
    FiltersComponent,
    PostMenuComponent,
    HomeComponent,
    FilteredPostsComponent,
    ProductDetailsComponent,
    TryAtHomeComponent,
    ArViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSliderModule,
    MatCheckboxModule,
    MatTabsModule,
    MatSnackBarModule,
    MatProgressBarModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
