import { Component } from "@angular/core";
import { ProductService } from "./../../shared/service/product.service";
import { Observable, forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { MasterService } from "../service/master.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  products: any[] = [];
  isLoading: Boolean = true;

  sizesMap: Map<number, string> = new Map();
  sizes: any[] = [];

  constructor(
    private productService: ProductService,
    private masterService: MasterService
  ) {}

  ngOnInit() {
    this.getProducts();

    this.productService.searchResults$.subscribe((results) => {
      this.products = results;
    });

    this.productService.getAllItems$.subscribe((results) => {
      this.products = results;
    });
  }

  getProducts() {
    this.productService.getAllProducts().subscribe((res) => {
      this.products = res;
      this.isLoading = false;
      this.products.forEach((product) => {
        this.fetchSizeDetails(product);
      });
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
