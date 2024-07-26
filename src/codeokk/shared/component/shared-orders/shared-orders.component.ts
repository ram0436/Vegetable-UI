import { Component, Input } from "@angular/core";
import { UserService } from "src/codeokk/modules/user/service/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-shared-orders",
  templateUrl: "./shared-orders.component.html",
  styleUrls: ["./shared-orders.component.css"],
  providers: [DatePipe],
})
export class SharedOrdersComponent {
  @Input() userId: number | null = null;
  @Input() apiType: "admin" | "user" = "user";

  orderedProducts: any[] = [];
  orders: any[] = [];
  adminRoute: boolean = false;
  showModal: boolean = false;

  title: string = "";
  message: string = "";

  validTitleMessage: boolean = false;
  validRatingMessage: boolean = false;
  selectedRating: number = 0;

  currentOrderMapping: any[] = [];

  isLoading: boolean = true;

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private router: Router,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.apiType === "user" && this.userId) {
      this.getOrdersByUserId(this.userId);
    } else if (this.apiType === "admin") {
      this.adminRoute = true;
      this.getAllOrders();
    }
  }

  handleRatingSelected(rating: any) {
    this.selectedRating = rating;
  }

  onSubmit() {
    if (this.message.length === 0) {
      this.validRatingMessage = true;
      return;
    }
    this.validRatingMessage = false;

    const reviewPromises = this.currentOrderMapping.map((mapping: any) => {
      const requestBody = {
        id: 0,
        review: this.message,
        createdBy: Number(localStorage.getItem("id")),
        rating: this.selectedRating,
        createdOn: new Date().toISOString(),
        productId: mapping.productId,
      };

      return this.userService.addUserReview(requestBody).toPromise();
    });

    Promise.all(reviewPromises)
      .then((responses) => {
        this.showNotification("Your rating has been added successfully");
      })
      .catch((error) => {
        this.showNotification("Failed to add rating");
      })
      .finally(() => {
        this.message = "";
        this.selectedRating = 0;
        this.showModal = false;
      });
  }

  showNotification(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }

  truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  }

  getAllOrders() {
    this.userService.getAllOrders().subscribe((data: any) => {
      this.orders = data.reverse();
      this.isLoading = false;
      this.populateOrderedProducts();
    });
  }

  getOrdersByUserId(userId: number) {
    this.userService.getOrderByUserId(userId).subscribe((data: any) => {
      this.orders = data.reverse();
      this.isLoading = false;
      this.populateOrderedProducts();
    });
  }

  populateOrderedProducts() {
    this.orders.forEach((order) => {
      let orderedProds: any[] = [];
      this.userService
        .getAddressByUserId(order.createdBy)
        .subscribe((addressData: any) => {
          const address = addressData[0];
          order.address = address;
          order.productOrderMapping.forEach((mapping: any) => {
            this.productService
              .getProductByProductId(mapping.productId)
              .subscribe((product: any) => {
                this.userService
                  .getProductImageByProductId(mapping.productId)
                  .subscribe((imageData: any) => {
                    product[0].imageURL = imageData.imageURL;
                    orderedProds.push(product);
                  });
              });
          });
          this.orderedProducts.push(orderedProds);
        });
    });
  }

  toggleModal(event: Event, productOrderMapping?: any[]) {
    event.preventDefault();
    event.stopPropagation();
    this.showModal = !this.showModal;
    if (productOrderMapping) {
      this.currentOrderMapping = productOrderMapping;
    }
  }

  calculateDeliveryDate(createdOn: string): string {
    const createdDate = new Date(createdOn);
    const deliveryDate = new Date(
      createdDate.setDate(createdDate.getDate() + 3)
    );
    const currentDate = new Date();
    if (currentDate < deliveryDate) {
      return (
        "Estimated Delivery " +
          this.datePipe.transform(deliveryDate, "dd MMM yyyy") || ""
      ); // Format the date using DatePipe, or return empty string if null
    } else {
      return (
        "Delivered On " +
          this.datePipe.transform(deliveryDate, "dd MMM yyyy") || ""
      );
    }
  }

  getOrderCreatorName(creatorId: any): string {
    if (creatorId === this.userId) {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        return userData ? userData.name : "";
      } else {
        return "";
      }
    } else {
      return creatorId;
    }
  }

  navigateToProductDetails(productCode: string) {
    this.router.navigate(["/product-details", productCode]);
  }

  getProductImage(product: any): string {
    if (
      product &&
      product.productImageList &&
      product.productImageList.length > 0
    ) {
      return product.productImageList[0].url;
    } else {
      return "../../../../../assets/no-img.png";
    }
  }
}
