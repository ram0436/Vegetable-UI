import { Component } from "@angular/core";
import { UserService } from "../../service/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.css"],
})
export class PaymentComponent {
  selectedCount: number = 0;
  totalMRP: number = 0;
  totalDiscount: number = 0;
  totalAmount: number = 0;
  selectCODOption: boolean = true;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.getPriceDetails();
  }

  selectCOD() {
    this.selectCODOption = !this.selectCODOption;
  }

  proceedToCheckout() {
    const orderPayload = this.userService.orderDetails;

    this.userService.createOrder(orderPayload).subscribe(
      (response) => {
        this.showNotification("Order placed successfully!");
        localStorage.removeItem("orderDetails");
        localStorage.removeItem("cart");
        this.userService.triggerPlaceOrder();
        this.router.navigate(["/user/orders"]);
      },
      (error) => {
        this.showNotification("Failed to place the order. Please try again.");
      }
    );
  }

  showNotification(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 2000,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }

  getPriceDetails() {
    this.selectedCount = this.userService.selectedCount;
    this.totalMRP = this.userService.totalMRP;
    this.totalDiscount = this.userService.totalDiscount;
    this.totalAmount = this.userService.totalAmount;
  }
}
