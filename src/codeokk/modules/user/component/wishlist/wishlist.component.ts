import { Component } from "@angular/core";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { UserService } from "./../../service/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { MasterService } from "src/codeokk/modules/service/master.service";

@Component({
  selector: "app-wishlist",
  templateUrl: "./wishlist.component.html",
  styleUrls: ["./wishlist.component.css"],
})
export class WishlistComponent {
  products: any[] = [];
  savedProducts: any[] = [];
  wishlistCount: number = 0;
  savedItems: any[] = [];
  selectedSize: number | null = null;
  isLoading: boolean = true;

  sizesMap: Map<number, string> = new Map();
  sizes: any[] = [];

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private masterService: MasterService
  ) {}

  ngOnInit() {
    this.getUserWishlistData();
    this.getAllProductSizes();
  }

  addToBag(productId: string) {
    const cartItem = {
      id: 0,
      productCode: productId,
      createdBy: Number(localStorage.getItem("id")),
      productSizeId: this.selectedSize,
      createdOn: new Date().toISOString(),
      modifiedBy: Number(localStorage.getItem("id")),
      modifiedOn: new Date().toISOString(),
      userId: Number(localStorage.getItem("id")),
    };

    this.userService.addToCart(cartItem).subscribe(
      (response: any) => {
        this.showNotification("Successfully Added to Cart");
        // this.productService.bagCount.subscribe((count) => {
        //   this.productService.updateBagCount(count + 1);
        // });
        // this.productService.bagCount += 1;
      },
      (error: any) => {}
    );
  }

  showNotification(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }

  updateWishlistCount() {
    this.wishlistCount--;
  }

  getAllProductSizes() {
    this.masterService.getAllProductSize().subscribe((res: any) => {
      this.sizes = res;
      this.sizesMap = this.createSizeMap(res);
    });
  }

  createSizeMap(sizes: any[]) {
    const map = new Map();
    sizes.forEach((size: any) => {
      map.set(size.id, size.size);
    });
    return map;
  }

  getUserWishlistData() {
    this.userService
      .getWishListByUserId(Number(localStorage.getItem("id")))
      .subscribe(
        (response: any) => {
          this.wishlistCount = response.length;
          this.savedItems = response;
          response.forEach((item: any) => {
            this.handleDashboardData(item);
          });
        },
        (error: any) => {}
      );
  }

  handleDashboardData(wishlistItem: any) {
    this.productService
      .getProductByProductCode(wishlistItem.productCode)
      .subscribe(
        (dashboardResponse: any) => {
          if (dashboardResponse) {
            const productDetails = Array.isArray(dashboardResponse)
              ? dashboardResponse[0]
              : dashboardResponse;
            // this.savedProducts.push({
            //   ...productDetails,
            //   cartId: wishlistItem.id,
            // });
            this.fetchSizeDetails(productDetails, wishlistItem.id);
          }
        },
        (dashboardError: any) => {
          console.error("Error fetching product details", dashboardError);
        }
      );
  }

  fetchSizeDetails(productDetails: any, wishlistItemId: number) {
    const sizeDetailRequests: Observable<any[]>[] =
      productDetails.productSizeMappingList.map((mapping: any) =>
        this.productService.getProductSizebyProductId(mapping.productId)
      );

    forkJoin(sizeDetailRequests).subscribe((responses: any[]) => {
      let productSizeDetails: any[] = [];

      responses.forEach((sizeDetailsArray, index) => {
        const mapping = productDetails.productSizeMappingList[index];
        sizeDetailsArray.forEach((sizeDetail: any) => {
          const sizeId = this.findSizeIdBySize(sizeDetail.size);

          const existingSize = productSizeDetails.find(
            (item) => item.size === sizeDetail.size
          );

          if (!existingSize) {
            productSizeDetails.push({
              id: sizeId,
              size: sizeDetail.size,
              price: sizeDetail.price,
            });
            productSizeDetails = this.removeDuplicateSizes(productSizeDetails);
          }
        });
      });

      this.savedProducts.push({
        ...productDetails,
        productSizeDetails,
        cartId: wishlistItemId,
      });

      this.isLoading = false;
    });
  }

  findSizeIdBySize(size: string) {
    for (let [id, sizeDescription] of this.sizesMap.entries()) {
      if (sizeDescription === size) {
        return id;
      }
    }
    return null;
  }

  // Utility function to remove duplicate sizes
  removeDuplicateSizes(sizes: any[]) {
    const uniqueSizes = sizes.reduce((acc, current) => {
      const x = acc.find((item: any) => item.size === current.size);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    return uniqueSizes;
  }

  removeItemFromWishlist(event: Event, cartId: any) {
    event.preventDefault();
    event.stopPropagation();

    this.userService
      .removeItemFromWishlist(cartId, Number(localStorage.getItem("id")))
      .subscribe(
        (response: any) => {
          this.savedProducts = this.savedProducts.filter(
            (product) => product.cartId !== cartId
          );
        },
        (error) => {}
      );
  }
}
