import { Component } from "@angular/core";
import { UserService } from "../../service/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.css"],
  providers: [DatePipe],
})
export class OrdersComponent {
  loggedInUserId: any;

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.loggedInUserId = Number(localStorage.getItem("id"));
  }
}
