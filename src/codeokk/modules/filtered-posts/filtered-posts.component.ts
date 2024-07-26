import { Component, HostListener } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { MasterService } from "../service/master.service";
import { Observable, filter, forkJoin } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-filtered-posts",
  templateUrl: "./filtered-posts.component.html",
  styleUrls: ["./filtered-posts.component.css"],
})
export class FilteredPostsComponent {
  products: any[] = [];
  originalProducts: any[] = [];

  brands: any[] = [];

  menuName: string = "";

  parentId: Number = 0;
  subCategoryId: Number = 0;
  categoryId: Number = 0;
  subMenuName: string = "";

  allParentCategories: any[] = [];
  allCategories: any[] = [];
  allsubCategories: any[] = [];

  breadcrumb: string = "";

  sizes: any[] = [];

  showSizeFilters: boolean = false;

  filtersToggled: boolean = false;

  selectedSizes: number[] = [];

  isScreenSmall: boolean = false;

  isLoading: Boolean = true;

  sizesMap: Map<number, string> = new Map();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private masterService: MasterService,
    private router: Router
  ) {
    this.checkScreenWidth();
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    this.isScreenSmall = window.innerWidth < 568;
  }

  ngOnInit() {
    this.checkScreenWidth();
    this.getAllProductSizes();
    this.route.queryParams.subscribe((params) => {
      this.parentId = params["parent"];
      if (params["category"] != undefined)
        this.categoryId = Number(params["category"]);
      if (params["subCategory"] != undefined)
        this.subCategoryId = Number(params["subCategory"]);
      else this.subCategoryId = 0;
      this.getProducts();
    });
    this.masterService.getData().subscribe((filters: any) => {
      this.filterProducts(filters);
    });
    this.getAllParentCategories();
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updateBreadcrumb();
      });
    this.productService.searchResults$.subscribe((results) => {
      let filteredProducts = results;

      filteredProducts = filteredProducts.filter((product) =>
        this.matchProductIds(product)
      );

      this.products = filteredProducts;
    });

    this.productService.getAllItems$.subscribe((results) => {
      let filteredProducts = results;

      filteredProducts = filteredProducts.filter((product) =>
        this.matchProductIds(product)
      );

      this.products = filteredProducts;
    });
  }

  toggleFilters() {
    this.filtersToggled = !this.filtersToggled;
  }

  showSize() {
    this.showSizeFilters = !this.showSizeFilters;
  }

  getAllProductSizes() {
    this.masterService.getAllProductSize().subscribe((res: any) => {
      this.sizes = res;
      this.sizesMap = this.createSizeMap(res);
    });
  }

  toggleSize(sizeId: number) {
    const index = this.selectedSizes.indexOf(sizeId);
    if (index === -1) {
      this.selectedSizes.push(sizeId);
    } else {
      this.selectedSizes.splice(index, 1);
    }
    this.filterProductFromSize();
  }

  sortProducts(criteria: string) {
    switch (criteria) {
      case "recommended":
        let filteredProducts = [...this.originalProducts];
        filteredProducts = filteredProducts.filter((product) =>
          this.matchProductIds(product)
        );
        this.products = filteredProducts;
        break;
      case "better-discount":
        this.products.sort((a, b) => {
          const discountA =
            parseInt(a.discount[0]?.percent.replace("% OFF", "")) || 0;
          const discountB =
            parseInt(b.discount[0]?.percent.replace("% OFF", "")) || 0;
          return discountB - discountA;
        });
        break;
      case "price-low-to-high":
        this.products.sort((a, b) => a.price - b.price);
        break;
      case "price-high-to-low":
        this.products.sort((a, b) => b.price - a.price);
        break;
    }
  }

  filterProductFromSize() {
    let filteredProducts = [...this.originalProducts];

    filteredProducts = filteredProducts.filter((product) =>
      this.matchProductIds(product)
    );

    if (this.selectedSizes.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.productSize.some((size: any) =>
          this.selectedSizes.includes(size.id)
        )
      );
    }

    this.products = filteredProducts;
  }

  clearFilters(event: Event) {
    event.preventDefault();
    window.location.reload();
  }

  applyFilters() {
    let filteredProducts = [...this.originalProducts];

    if (this.selectedSizes.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.sizes.some((size: any) => this.selectedSizes.includes(size.id))
      );
    }

    this.products = filteredProducts;
  }

  updateBreadcrumb() {
    let breadcrumbParts: string[] = [];

    const parentCategory = this.allParentCategories.find((category) => {
      return category.id.toString() === this.parentId.toString();
    });

    if (parentCategory) {
      breadcrumbParts.push(parentCategory.name);
    }

    const category = this.allCategories.find((category) => {
      return category.id.toString() === this.categoryId.toString();
    });
    if (category) {
      breadcrumbParts.push(category.name);
    }

    const subCategory = this.allsubCategories.find((category) => {
      return category.id.toString() === this.subCategoryId.toString();
    });
    if (subCategory) {
      breadcrumbParts.push(subCategory.name);
    }

    this.breadcrumb = breadcrumbParts.join(" / ");
  }

  getAllParentCategories() {
    this.masterService.getAllParentCategories().subscribe((data: any) => {
      this.allParentCategories = data;
      data.forEach((parentCategory: any) => {
        this.getAllCategoryByParentCategoryId(parentCategory.id);
      });
    });
  }

  getAllCategoryByParentCategoryId(parentCategoryId: number) {
    this.masterService
      .getCategoryByParentCategoryId(parentCategoryId)
      .subscribe((data: any) => {
        this.allCategories.push(...data);
        data.forEach((category: any) => {
          this.getAllSubCategoryByCategoryId(category.id);
        });
      });
  }

  getAllSubCategoryByCategoryId(categoryId: number) {
    this.masterService
      .getSubCategoryByCategoryId(categoryId)
      .subscribe((data: any) => {
        this.allsubCategories.push(...data);
        this.updateBreadcrumb();
      });
  }

  matchProductIds(product: any): boolean {
    const categoryId = Number(this.categoryId);
    const subCategoryId = Number(this.subCategoryId);
    const parentId = Number(this.parentId);

    if (
      product.category[0] &&
      product.subCategory[0] &&
      product.parentCategory[0]
    ) {
      return (
        (categoryId === 0 || product.category[0].id === categoryId) &&
        (subCategoryId === 0 || product.subCategory[0].id === subCategoryId) &&
        (parentId === 0 || product.parentCategory[0].id === parentId)
      );
    }
    return false;
  }

  filterProducts(filters?: any) {
    let filteredProducts = [...this.originalProducts];

    filteredProducts = filteredProducts.filter((product) =>
      this.matchProductIds(product)
    );

    // Filter by category
    if (filters.categories.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        filters.categories.includes(product.subCategory[0].id)
      );
    }

    // Filter by brand
    // if (filters.brands.length > 0) {
    //   filteredProducts = filteredProducts.filter((product) =>
    //     product.brand.some((b: any) => filters.brands.includes(b.id))
    //   );
    // }

    // Filter by color
    if (filters.colors.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.color.some((c: any) => filters.colors.includes(c.id))
      );
    }

    // Filter by discount
    if (filters.discount.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.discount.some((d: any) => filters.discount.includes(d.id))
      );
    }

    filteredProducts = filteredProducts.filter(
      (product) =>
        product.price >= filters.minPrice && product.price <= filters.maxPrice
    );

    this.products = filteredProducts;

    this.isLoading = false;

    // this.productService.getAllProducts().subscribe((res) => {
    //   this.products = res.filter((product) => {
    //     const categoryId = Number(this.categoryId);
    //     const subCategoryId = Number(this.subCategoryId);
    //     const parentId = Number(this.parentId);
    //     const brandIds = filters.brands;

    //     if (
    //       (filters.categories.length === 0 ||
    //         filters.categories.includes(product.subCategory[0].id)) &&
    //       (filters.colors.length === 0 ||
    //         product.color.some((color: any) =>
    //           filters.colors.includes(color.id)
    //         )) &&
    //       (filters.brands.length === 0 ||
    //         product.brand.some((brand: any) => brandIds.includes(brand.id))) &&
    //       (filters.discount === 0 ||
    //         product.discount.some(
    //           (discount: any) => discount.percent >= filters.discount
    //         )) &&
    //       (categoryId === 0 || product.category[0].id === categoryId) &&
    //       (subCategoryId === 0 ||
    //         product.subCategory[0].id === subCategoryId) &&
    //       (parentId === 0 || product.parentCategory[0].id === parentId)
    //     ) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   });
    // });
  }

  getProducts() {
    this.productService.getAllProducts().subscribe((res) => {
      this.originalProducts = [...res];
      this.products = res.filter((product) => {
        const categoryId = Number(this.categoryId);
        const subCategoryId = Number(this.subCategoryId);
        const parentId = Number(this.parentId);

        if (categoryId !== 0 && product.category[0].id !== categoryId) {
          return false;
        }

        if (
          subCategoryId !== 0 &&
          product.subCategory[0].id !== subCategoryId
        ) {
          return false;
        }

        if (parentId !== 0 && product.parentCategory[0].id !== parentId) {
          return false;
        }

        return true;
      });

      // const uniqueBrands = Array.from(
      //   new Set(
      //     this.products.map((product) => JSON.stringify(product.brand[0]))
      //   )
      // ).map((brandStr) => JSON.parse(brandStr));

      // this.masterService.setBrandsData({
      //   brands: uniqueBrands,
      // });

      this.products.forEach((product) => {
        this.fetchSizeDetails(product);
      });

      this.isLoading = false;
    });
  }

  createSizeMap(sizes: any[]) {
    const map = new Map();
    sizes.forEach((size: any) => {
      map.set(size.id, size.size);
    });
    return map;
  }

  fetchSizeDetails(productDetails: any) {
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

      productDetails.productSizeDetails = productSizeDetails;

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
}
