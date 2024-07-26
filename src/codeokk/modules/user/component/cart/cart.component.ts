import { Component, EventEmitter, Output } from "@angular/core";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { UserService } from "../../service/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Observable, forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { MasterService } from "src/codeokk/modules/service/master.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent {
  @Output() itemRemovedFromCart = new EventEmitter<void>();

  offers: string[] = [
    "10% Instant Discount on Citi-branded Credit and Debit Cards on a minimum spend of ₹3,000. TCA",
    "10% Instant Discount on Citi-branded Credit and Debit Cards on a minimum spend of ₹3,000. TCA",
    "10% Instant Discount on Citi-branded Credit and Debit Cards on a minimum spend of ₹3,000. TCA",
  ];
  showMore: boolean = false;
  cartProducts: any[] = [];
  cartCount: number = 0;
  cartItems: any[] = [];
  selectedCount: number = 0;
  totalMRP: number = 0;
  totalAmount: number = 0;
  totalDiscount: number = 0;
  showModal: boolean = false;
  showQtyModal: boolean = false;
  selectedProduct: any;
  selectedSize: string = "";
  selectedQty: number = 1;
  qtyOptions: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  selectedProducts: any[] = [];

  isLoading: Boolean = true;

  sizesMap: Map<number, string> = new Map();
  sizes: any[] = [];
  productSizeDetails: any[] = [];

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private masterService: MasterService
  ) {}

  ngOnInit() {
    this, this.getAllProductSizes();
    this.getUserCartData();
    this.userService.placeOrder$.subscribe(() => {
      localStorage.removeItem("cart");
      localStorage.removeItem("orderDetails");
      this.removeSelectedProducts(this.selectedProducts);
    });
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

  removeProducts() {
    const userId = Number(localStorage.getItem("id"));
    this.selectedProducts = this.cartProducts.filter(
      (product) => product.selected
    );

    if (this.selectedProducts.length === 0) {
      this.showNotification(
        "Please select at least one product to place an order."
      );
      return;
    }

    const orderPayload = {
      createdBy: userId,
      createdOn: new Date().toISOString(),
      modifiedBy: userId,
      modifiedOn: new Date().toISOString(),
      id: 0,
      productOrderMapping: this.selectedProducts.map((product) => ({
        id: 0,
        productId: Number(product.id),
      })),
      totalAmount: Math.round(this.totalAmount),
    };

    this.userService.orderDetails = orderPayload;
    this.router.navigate(["/user/address"]);
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
  }

  toggleModal(event: Event, product?: any) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedProduct = product;
    this.showModal = !this.showModal;
  }

  toggleQtyModal(event: Event, product?: any) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedProduct = product;
    this.showQtyModal = !this.showQtyModal;
  }

  selectSize(sizeDetail: any) {
    if (this.selectedProduct) {
      this.selectedProduct.size = sizeDetail.size;
      this.selectedSize = sizeDetail.id;
    }
  }

  selectQuantity(quantity: number) {
    if (this.selectedProduct) {
      this.selectedProduct.quantity = quantity;
      // this.updateTotals();
    }
  }

  doneSelection() {
    this.showModal = false;
    this.showQtyModal = false;
    this.updateTotals();
  }

  getUserCartData() {
    this.userService
      .getCartItemByUserId(Number(localStorage.getItem("id")))
      .subscribe(
        (response: any) => {
          this.isLoading = false;
          this.cartItems = response;
          response.forEach((item: any) => {
            this.handleDashboardData(item);
          });
        },
        (error: any) => {}
      );
  }

  toggleSelection(event: Event, product: any) {
    event.preventDefault();
    event.stopPropagation();
    product.selected = !product.selected;
    this.selectedCount = this.cartProducts.filter((p) => p.selected).length;
    this.updateTotals();
  }

  toggleBulkSelection(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.selectedCount === this.cartProducts.length) {
      // Deselect all
      this.cartProducts.forEach((product) => (product.selected = false));
      this.selectedCount = 0;
    } else if (this.selectedCount === 0) {
      // Select all
      this.cartProducts.forEach((product) => (product.selected = true));
      this.selectedCount = this.cartProducts.length;
    } else {
      // Deselect one by one
      for (const product of this.cartProducts) {
        if (product.selected) {
          product.selected = false;
          this.selectedCount--;
          break;
        }
      }
    }
    this.updateTotals();
  }

  updateTotals() {
    this.selectedCount = this.cartProducts.filter(
      (product) => product.selected
    ).length;
    this.totalMRP = this.cartProducts
      .filter((product) => product.selected)
      .reduce((total, product) => total + product.price * product.quantity, 0);
    this.totalDiscount = Math.round(
      this.cartProducts
        .filter((product) => product.selected)
        .reduce((total, product) => {
          const discountPercent = product.discount?.[0]?.percent
            .replace("% OFF", "")
            .trim();
          const discountValue =
            product.price * (parseFloat(discountPercent) / 100);
          return total + discountValue;
        }, 0)
    );
    this.totalAmount = this.totalMRP - this.totalDiscount;
    this.userService.selectedCount = this.selectedCount;
    this.userService.totalMRP = this.totalMRP;
    this.userService.totalDiscount = this.totalDiscount;
    this.userService.totalAmount = this.totalAmount;
  }

  getProductSizes(product: any): string[] {
    return product.productSize.map((size: any) => size.size);
  }

  handleDashboardData(cartItem: any) {
    this.productService.getProductByProductCode(cartItem.productCode).subscribe(
      (dashboardResponse: any) => {
        if (dashboardResponse) {
          const productDetails = Array.isArray(dashboardResponse)
            ? dashboardResponse[0]
            : dashboardResponse;
          // this.cartProducts.push({
          //   ...productDetails,
          //   cartId: cartItem.id,
          //   quantity: 1,
          // });
          this.fetchSizeDetails(productDetails, cartItem.id);
        }
      },
      (dashboardError: any) => {}
    );
  }
  fetchSizeDetails(productDetails: any, cartItemId: number) {
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

      this.cartProducts.push({
        ...productDetails,
        cartId: cartItemId,
        productSizeDetails,
        quantity: 1,
      });
    });
  }

  getImageUrl(product: any): string {
    if (product.productImageList.length > 0) {
      return product.productImageList[0].imageURL;
    } else {
      return "/assets/no-img.png";
    }
  }

  removeSelectedProducts(selectedProducts: any[]) {
    const userId = Number(localStorage.getItem("id"));

    selectedProducts.forEach((product) => {
      this.userService.removeItemFromCart(product.cartId, userId).subscribe(
        (response: any) => {
          this.cartProducts = this.cartProducts.filter(
            (p) => p.cartId !== product.cartId
          );

          // this.updateTotals();
        },
        (error) => {
          console.error("Error removing product from cart:", error);
        }
      );
    });
  }

  removeItemFromCart(event: Event, cartId: any) {
    event.preventDefault();
    event.stopPropagation();

    this.userService
      .removeItemFromCart(cartId, Number(localStorage.getItem("id")))
      .subscribe(
        (response: any) => {
          this.cartProducts = this.cartProducts.filter(
            (product) => product.cartId !== cartId
          );
          this.updateTotals();
        },
        (error) => {}
      );
  }

  showNotification(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 2000,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }

  getProductSize(product: any): string {
    // Assuming productSize is an array of sizes and we are using the first size
    return product.productSize && product.productSize.length > 0
      ? product.productSize[0].size
      : "";
  }
}
