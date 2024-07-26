import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "../../service/product.service";
import { UserService } from "src/codeokk/modules/user/service/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoginComponent } from "src/codeokk/modules/user/component/login/login.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-post-cards",
  templateUrl: "./post-cards.component.html",
  styleUrls: ["./post-cards.component.css"],
})
export class PostCardsComponent {
  ratingsMap: Map<string, { averageRating: number; totalRatings: number }> =
    new Map();
  isScreenSmall: boolean = false;
  @Input() products: any;
  @Output() itemRemovedFromWishlist = new EventEmitter<void>();
  favoriteStatus: { [key: string]: boolean } = {};
  wishlistRoute: boolean = false;
  isUserLogedIn: boolean = false;
  filteredPostsRoute: boolean = false;
  dialogRef: MatDialogRef<any> | null = null;

  // Pagination properties
  currentPage: number = 1;
  productsPerPage: number = 24;
  wishlistCount: number = 0;

  selectedSize: number | null = null;

  showModal: boolean = false;
  selectedProduct: any;

  hoveredProduct: string | null = null;
  isAdmin: boolean = false;

  showAdminOptions: boolean = false;
  adminOptionsVisibleFor: string | null = null;

  constructor(
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
    private userService: UserService,
    private renderer: Renderer2,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private elementRef: ElementRef
  ) {
    this.route.queryParams.subscribe((params) => {
      const routeName = this.router.url.split("?")[0];
      this.productsPerPage = routeName === "/filtered-posts" ? 25 : 24;
    });

    this.route.url.subscribe((urlSegments) => {
      this.wishlistRoute =
        urlSegments.length > 0 && urlSegments[0].path === "wishlist";
      this.filteredPostsRoute =
        urlSegments.length > 0 && urlSegments[0].path === "filtered-posts";
    });
    this.checkScreenWidth();
  }

  ngOnInit() {
    this.checkScreenWidth();
    var role = localStorage.getItem("role");
    if (role != null && role == "Admin") this.isAdmin = true;
    else this.isAdmin = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["products"] && changes["products"].currentValue) {
      this.fetchReviewsData();
    }
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    this.isScreenSmall = window.innerWidth < 768;
  }

  deleteProduct(event: Event, productId: any) {
    event.stopPropagation();
    event.preventDefault();
    this.productService.deleteProduct(productId).subscribe(
      (response: any) => {
        this.showNotification("Product Deleted Successfylly");
        window.location.reload();
      },
      (error: any) => {}
    );
  }

  editProduct(event: Event, product: any) {
    event.stopPropagation();
    event.preventDefault();
    this.router.navigateByUrl(
      `admin/dashboard?editProduct=true&code=${product.productCode}`
    );
  }

  toggleAdminOptions(event: Event, productCode: string) {
    event.stopPropagation();
    event.preventDefault();
    if (this.adminOptionsVisibleFor === productCode) {
      this.adminOptionsVisibleFor = null;
    } else {
      this.adminOptionsVisibleFor = productCode;
    }
  }

  initImageSlider(productCode: string) {
    if (!this.isScreenSmall) {
      this.hoveredProduct = productCode;
      const swiperEls =
        this.elementRef.nativeElement.querySelectorAll(".swiper-cont");
      swiperEls.forEach((swiperEl: any) => {
        const buttonNext = swiperEl.querySelector(".next-btn");
        const buttonPrev = swiperEl.querySelector(".prev-btn");

        const swiperParams = {
          slidesPerView: 1,
          spaceBetween: 10,
          loop: true,
          pagination: true,
          // pagination: {
          //   el: ".swiper-pagination",
          // },
          autoplay: {
            delay: 1000,
            disableOnInteraction: false,
          },
          injectStyles: [
            `
            .swiper-pagination-bullet{
              background-color: var(--dynamic-app-color);
              z-index: 6;
            }

            .swiper-horizontal > .swiper-pagination-bullets,
            .swiper-pagination-bullets.swiper-pagination-horizontal {
                bottom: 0px !important;
              }

        `,
          ],
          on: {
            init() {
              // ...
            },
          },
        };

        Object.assign(swiperEl, swiperParams);
        swiperEl.initialize();
        if (buttonNext && buttonPrev) {
          this.renderer.listen(buttonNext, "click", () => {
            swiperEl.swiper.slideNext();
          });
          this.renderer.listen(buttonPrev, "click", () => {
            swiperEl.swiper.slidePrev();
          });
        }
      });
    }
  }

  resetHover() {
    if (!this.isScreenSmall) {
      this.hoveredProduct = "0";
    }
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.productsPerPage;
  }

  get endIndex(): number {
    return Math.min(
      this.startIndex + this.productsPerPage,
      this.products.length
    );
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // get pageNumbers(): number[] {
  //   return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  // }

  get pageNumbers(): (number | string)[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    if (totalPages <= 5) {
      // Show all pages if there are 5 or fewer
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let pages: (number | string)[] = [];

    if (currentPage <= 2) {
      // If on one of the first three pages, show 1, 2, 3, 4, ..., totalPages
      pages = [1, 2, 3, "...", totalPages];
    } else if (currentPage >= 3 && currentPage < totalPages - 2) {
      // If in the middle somewhere, show 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
      pages = [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      ];
    } else {
      // If near the end, show 1, ..., totalPages-3, totalPages-2, totalPages-1, totalPages
      pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return pages;
  }

  isNumber(value: any): value is number {
    return typeof value === "number";
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.productsPerPage);
  }

  get currentPageProducts(): any[] {
    return this.products.slice(this.startIndex, this.endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.products.length / this.productsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }

  fetchReviewsData() {
    for (const product of this.products) {
      this.userService.GetRatingReviewByProductId(product.id).subscribe(
        (data: any) => {
          product.reviewsData = data;
          this.calculateAverageRating(product);
        },
        (error) => {
          console.error("Error fetching reviews data:", error);
        }
      );
    }
  }

  calculateAverageRating(product: any) {
    const totalReviews = product.reviewsData.length;
    let totalRating = 0;

    for (const review of product.reviewsData) {
      totalRating += review.rating;
    }

    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
    this.ratingsMap.set(product.id, {
      averageRating: averageRating,
      totalRatings: totalReviews,
    });
  }

  toggleModal(event: Event, product?: any) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedProduct = product;
    this.showModal = !this.showModal;
  }

  doneSelection(event: Event, productCode: any) {
    event.preventDefault();
    event.stopPropagation();
    this.showModal = false;
    this.addToBag(productCode);
  }

  getProductSizes(product: any): string[] {
    return product.productSize.map((size: any) => size.size);
  }

  selectSize(event: Event, sizeId: number) {
    event.preventDefault();
    event.stopPropagation();
    if (this.selectedProduct) {
      this.selectedSize = sizeId;
    }
  }

  addToBag(productId: string) {
    const cartItem = {
      id: 0,
      productCode: productId,
      createdBy: Number(localStorage.getItem("id")),
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

  getImageUrl(product: any): string {
    if (
      product.productImageList !== null &&
      product.productImageList.length > 0
    ) {
      return product.productImageList[0].imageURL;
    } else {
      return "/assets/no-img.png";
    }
  }

  removeItemFromWishlist(event: Event, cartId: any) {
    event.preventDefault();
    event.stopPropagation();

    this.userService
      .removeItemFromWishlist(cartId, Number(localStorage.getItem("id")))
      .subscribe(
        (response: any) => {
          this.products = this.products.filter(
            (product: any) => product.cartId !== cartId
          );
          this.itemRemovedFromWishlist.emit();
        },
        (error) => {}
      );
  }

  toggleFavorite(event: Event, productId: string) {
    event.preventDefault();
    event.stopPropagation();

    if (localStorage.getItem("id") != null) {
      // Toggle favorite status
      this.favoriteStatus[productId] = !this.favoriteStatus[productId];

      // Call addToWishlist method
      if (this.favoriteStatus[productId]) {
        this.addToWishlist(productId);
      } else {
        // You can implement removal from wishlist if needed
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
