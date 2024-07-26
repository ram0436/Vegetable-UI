import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { UserService } from "src/codeokk/modules/user/service/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { LoginComponent } from "../user/component/login/login.component";
import { forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { MasterService } from "../service/master.service";

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.css"],
})
export class ProductDetailsComponent {
  @Output() itemAddedToCart = new EventEmitter<void>();

  showModal: boolean = false;
  productDetails: any;
  favoriteStatus: { [key: string]: boolean } = {};
  selectedSize: number = 0;
  dialogRef: MatDialogRef<any> | null = null;
  isUserLogedIn: boolean = false;

  currentIndex = 0;

  reviewsData: any[] = [];
  averageRating: number = 0;
  totalRatings: number = 0;
  ratingDistribution: { level: number; count: number; percentage: number }[] =
    [];
  showAllReviews: boolean = false;

  isFullscreen: boolean = false;
  currentImageUrl: string = "";
  currentImageIndex: number = 0;

  sizesMap: Map<number, string> = new Map();
  sizes: any[] = [];

  @ViewChildren("imageElement") imageElements!: QueryList<ElementRef>;
  currentRects: DOMRect[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private masterService: MasterService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    var productCode;
    this.route.paramMap.subscribe((params) => {
      productCode = params.get("id");
    });
    if (productCode != null) {
      this.getPostDetails(productCode);
    }
  }

  onMouseEnter(event: MouseEvent, index: number) {
    const img = this.imageElements.toArray()[index].nativeElement;
    img.style.setProperty("--zoom", "4.5");
  }

  onMouseMove(event: MouseEvent, index: number) {
    const img = this.imageElements.toArray()[index].nativeElement;
    const rect = img.getBoundingClientRect();

    if (rect) {
      const x = rect.left;
      const y = rect.top;
      const width = rect.width;
      const height = rect.height;

      const horizontal = ((event.clientX - x) / width) * 100;
      const vertical = ((event.clientY - y) / height) * 100;

      img.style.setProperty("--x", `${horizontal}%`);
      img.style.setProperty("--y", `${vertical}%`);
    }
  }

  onMouseLeave(event: MouseEvent, index: number) {
    const img = this.imageElements.toArray()[index].nativeElement;
    img.style.setProperty("--zoom", "1");
  }

  tryAtHome(imageUrl: string) {
    this.router.navigate(["/try-at-home"], { queryParams: { imageUrl } });
  }

  openFullscreen(index: number): void {
    this.currentImageIndex = index;
    this.currentImageUrl = this.productDetails.productImageList[index].imageURL;
    this.isFullscreen = true;
  }

  changeImage(direction: number): void {
    this.currentImageIndex += direction;
    if (this.currentImageIndex >= this.productDetails.productImageList.length) {
      this.currentImageIndex = 0; // Loop to first image
    }
    if (this.currentImageIndex < 0) {
      this.currentImageIndex = this.productDetails.productImageList.length - 1; // Loop to last image
    }
    this.currentImageUrl =
      this.productDetails.productImageList[this.currentImageIndex].imageURL;
  }

  closeFullscreen(): void {
    this.isFullscreen = false;
  }

  showNextImage(): void {
    if (this.currentIndex < this.productDetails.productImageList.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Loop to the first image
    }
  }

  showPrevImage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.productDetails.productImageList.length - 1; // Loop to the last image
    }
  }
  getRatingData(productId: any) {
    this.userService.GetRatingReviewByProductId(productId).subscribe(
      (data: any) => {
        this.reviewsData = data;
        this.calculateAverageAndTotalRatings();
        this.calculateRatingDistribution();
      },
      (error: any) => {}
    );
  }

  calculateAverageAndTotalRatings() {
    if (this.reviewsData.length > 0) {
      this.totalRatings = this.reviewsData.length;

      const sumOfRatings = this.reviewsData.reduce(
        (total, review) => total + review.rating,
        0
      );
      this.averageRating = sumOfRatings / this.totalRatings;
    }
  }

  calculateRatingDistribution() {
    const ratingCounts = [0, 0, 0, 0, 0];

    this.reviewsData.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingCounts[review.rating - 1]++;
      }
    });

    this.ratingDistribution = ratingCounts.map((count, index) => {
      const percentage = (count / this.totalRatings) * 100;
      return { level: 5 - index, count, percentage };
    });

    this.ratingDistribution.reverse();
  }

  toggleReviews() {
    this.showAllReviews = !this.showAllReviews;
  }

  parseAverageRating(): number {
    return parseFloat(this.averageRating.toFixed(1));
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  get currentImage() {
    return this.productDetails?.productImageList[this.currentIndex];
  }

  selectSize(sizeId: number) {
    this.selectedSize = sizeId;
  }

  addToBag(productId: string) {
    if (localStorage.getItem("id") != null) {
      if (this.selectedSize !== 0) {
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
      } else {
        this.showNotification("Please Select A Size First");
      }
    } else {
      this.openLoginModal();
    }
  }

  openLoginModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    this.dialogRef = this.dialog.open(LoginComponent, { width: "450px" });

    this.dialogRef.afterClosed().subscribe((result) => {
      if (localStorage.getItem("authToken") != null) this.isUserLogedIn = true;
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

  // Function to get product details and size information
  getPostDetails(code: any) {
    this.productService.getProductByProductCode(code).subscribe((res: any) => {
      if (res && res.description) {
        res.description = res.description.replace(/\n/g, "<br/>");
      }
      this.productDetails = res;

      // Ensure all sizes are fetched before proceeding
      this.getAllProductSizes();
      this.fetchSizeDetails(this.productDetails.productSizeMappingList);

      this.getRatingData(this.productDetails.id);
    });
  }

  // Function to fetch size details and update product details
  fetchSizeDetails(sizeMappingList: any[]) {
    const sizeDetailRequests = sizeMappingList.map((mapping) =>
      this.productService.getProductSizebyProductId(mapping.productId)
    );

    forkJoin(sizeDetailRequests).subscribe((responses: any[]) => {
      this.productDetails.productSize = [];

      responses.forEach((sizeDetailsArray, index) => {
        const productId = sizeMappingList[index].productId;
        const productSizeId = sizeMappingList[index].productSizeId;

        const sizes = sizeDetailsArray.map((sizeDetail: any) => {
          const sizeId = this.findSizeIdBySize(sizeDetail.size);
          return {
            size: sizeDetail.size,
            price: sizeDetail.price,
            id: sizeId || null,
          };
        });

        this.productDetails.productSize = [
          ...this.productDetails.productSize,
          ...sizes,
        ];
      });

      this.productDetails.productSize = this.removeDuplicateSizes(
        this.productDetails.productSize
      );
    });
  }

  // Utility function to find size ID by size description
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

  // fetchSizeDetails(sizeMappingList: any[]) {
  //   const sizeDetailRequests = sizeMappingList.map((mapping) =>
  //     this.productService.getProductSizebyProductId(mapping.productId)
  //   );

  //   forkJoin(sizeDetailRequests).subscribe((responses) => {
  //     this.productDetails.productSize = sizeMappingList.map(
  //       (mapping, index) => {
  //         const sizeDetailsArray = responses[index];
  //         const sizeDetail = sizeDetailsArray.find(
  //           (detail: any) => detail.size === mapping.productSizeId
  //         );
  //         return {
  //           ...sizeDetail,
  //           id: mapping.productSizeId,
  //         };
  //       }
  //     );
  //   });
  // }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  toggleFavorite(event: Event, productId: string) {
    event.preventDefault();
    event.stopPropagation();

    if (localStorage.getItem("id") != null) {
      this.favoriteStatus[productId] = this.favoriteStatus[productId] || false;

      this.favoriteStatus[productId] = !this.favoriteStatus[productId];

      if (this.favoriteStatus[productId]) {
        this.addToWishlist(productId);
      } else {
      }
    } else {
      this.openLoginModal();
    }
  }

  addToWishlist(productId: string) {
    const wishlistItem = {
      id: 0,
      productCode: productId,
      createdBy: Number(localStorage.getItem("id")),
      userId: Number(localStorage.getItem("id")),
      modifiedBy: Number(localStorage.getItem("id")),
      // createdBy: localStorage.getItem("id"),
      createdOn: new Date().toISOString(),
      modifiedOn: new Date().toISOString(),
    };

    this.userService.addWishList(wishlistItem).subscribe(
      (response: any) => {
        this.showNotification("Successfully Added to Wishlist");
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
}
