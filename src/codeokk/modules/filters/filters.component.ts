import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { forkJoin } from "rxjs";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { MasterService } from "../service/master.service";
import { map } from "rxjs/operators";

@Component({
  selector: "app-filters",
  templateUrl: "./filters.component.html",
  styleUrls: ["./filters.component.css"],
})
export class FiltersComponent {
  products: any[] = [];
  colors: any[] = [];
  discounts: any[] = [];
  sizes: any[] = [];
  brands: any[] = [];

  parentId: Number = 0;
  subCategoryId: Number = 0;
  categoryId: Number = 0;
  subMenuName: string = "";

  categories: any = [];

  menuId: number = 0;

  discountRanges: number[] = [10, 20, 30];

  selectedCategories: number[] = [];
  selectedColors: number[] = [];
  selectedBrands: number[] = [];
  selectedDiscount: number[] = [];

  brandsExpanded: boolean = false;
  colorsExpanded: boolean = false;

  brandSearchText: string = "";
  colorSearchText: string = "";

  showAllBrands: boolean = false;
  showAllColors: boolean = false;
  showAllDiscounts: boolean = false;

  allParentCategories: any[] = [];
  allCategories: any[] = [];
  allsubCategories: any[] = [];

  breadcrumb: string = "";

  private allDataLoaded: boolean = false;

  private categorySubcategoriesLoaded: { [key: number]: boolean } = {};

  sliderMin: number = 0;
  sliderMax: number = 5000;
  sliderValue: number = 0;
  sliderMaxValue: number = 5000;
  minValue: number = this.sliderValue;
  maxValue: number = this.sliderMaxValue;
  fromPrice = 0;
  toPrice = 5000;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private masterService: MasterService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.parentId = params["parent"];
      if (params["category"] != undefined)
        this.categoryId = Number(params["category"]);
      if (params["subCategory"] != undefined)
        this.subCategoryId = Number(params["subCategory"]);
      else this.subCategoryId = 0;
      this.getBrand(this.subCategoryId);

      // this.getBrands();
      if (params["category"] != undefined)
        this.menuId = Number(params["category"]);
      this.getSubCategoryByCategoryId(this.menuId);
      if (this.subCategoryId === 0) {
        this.getBrandByCategoryId(this.categoryId);
        this.getColorByCategoryId(this.categoryId);
        this.getDiscountByCategoryId(this.categoryId);
        // this.getSubCategoryByCategoryId(this.categoryId);
      } else if (this.subCategoryId !== 0) {
        this.getBrand(this.subCategoryId);
        this.getColorBySubCategoryId(this.subCategoryId);
        this.getDiscountBySubCategoryId(this.subCategoryId);
      }
    });
  }

  updateSlider() {
    if (this.minValue < this.sliderMin) this.minValue = this.sliderMin;
    if (this.maxValue > this.sliderMax) this.maxValue = this.sliderMax;
    if (this.minValue > this.maxValue) this.minValue = this.maxValue;
    if (this.maxValue < this.minValue) this.maxValue = this.minValue;
    this.sliderValue = this.minValue;
    this.sliderMaxValue = this.maxValue;
  }

  onSliderChange(event: any) {
    const newValue = event.value;
    if (newValue < this.minValue) {
      this.minValue = newValue;
    } else if (newValue > this.maxValue) {
      this.maxValue = newValue;
    }
  }

  get filteredBrands() {
    return this.brands.filter((brand) =>
      brand.name.toLowerCase().includes(this.brandSearchText.toLowerCase())
    );
  }

  get filteredColors() {
    return this.colors.filter((color) =>
      color.name.toLowerCase().includes(this.colorSearchText.toLowerCase())
    );
  }

  getAllDiscount() {
    this.masterService.getAllDiscount().subscribe((res: any) => {
      this.discounts = res;
    });
  }

  getAllColors() {
    this.masterService.getAllColors().subscribe((res: any) => {
      this.colors = res;
    });
  }

  getSubCategoryByCategoryId(categoryId: any) {
    this.masterService
      .getSubCategoryByCategoryId(categoryId)
      .subscribe((data: any) => {
        this.categories = data;
      });
  }

  getDiscountByCategoryId(categoryId: any) {
    this.masterService
      .getAllDiscountByCategoryId(categoryId)
      .subscribe((data: any) => {
        this.discounts = data;
      });
  }

  getColorByCategoryId(categoryId: any) {
    this.masterService
      .getAllColorByCategoryId(categoryId)
      .subscribe((data: any) => {
        this.colors = data;
      });
  }

  getDiscountBySubCategoryId(categoryId: any) {
    this.masterService
      .getAllDiscountBySubCategoryId(categoryId)
      .subscribe((data: any) => {
        this.discounts = data;
      });
  }

  getColorBySubCategoryId(subCategoryId: any) {
    this.masterService
      .getAllColorBySubCategoryId(subCategoryId)
      .subscribe((data: any) => {
        this.colors = data;
      });
  }

  getBrand(subCategoryId: any) {
    this.masterService
      .getBrandBySubCategoryId(subCategoryId)
      .subscribe((data: any) => {
        this.brands = data;
      });
  }

  getBrandByCategoryId(categoryId: any) {
    this.masterService
      .getBrandByCategoryId(categoryId)
      .subscribe((data: any) => {
        this.brands = data;
      });
  }

  getAllProductSizes() {
    this.masterService.getAllProductSize().subscribe((res: any) => {
      this.sizes = res;
    });
  }

  toggleBrandsSearch() {
    this.brandsExpanded = !this.brandsExpanded;
  }

  toggleBrand(brandId: number) {
    const index = this.selectedBrands.indexOf(brandId);
    if (index === -1) {
      this.selectedBrands.push(brandId);
    } else {
      this.selectedBrands.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleColorsSearch() {
    this.colorsExpanded = !this.colorsExpanded;
  }

  toggleColor(colorId: number) {
    const index = this.selectedColors.indexOf(colorId);
    if (index === -1) {
      this.selectedColors.push(colorId);
    } else {
      this.selectedColors.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleDiscount(discountId: number) {
    const index = this.selectedDiscount.indexOf(discountId);
    if (index === -1) {
      this.selectedDiscount.push(discountId);
    } else {
      this.selectedDiscount.splice(index, 1);
    }
    this.applyFilters();
  }

  // selectDiscount(range: string) {
  //   this.selectedDiscount = range;
  //   this.applyFilters();
  // }

  toggleCategory(categoryId: number) {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index === -1) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories.splice(index, 1);
    }
    this.applyFilters();
  }

  applyFilters() {
    this.masterService.setData({
      categories: this.selectedCategories,
      colors: this.selectedColors,
      brands: this.selectedBrands,
      minPrice: this.minValue,
      maxPrice: this.maxValue,
      discount: this.selectedDiscount,
    });
  }

  toggleShowAllBrands() {
    this.showAllBrands = !this.showAllBrands;
  }

  toggleShowAllColors() {
    this.showAllColors = !this.showAllColors;
  }

  toggleShowAllDiscounts() {
    this.showAllDiscounts = !this.showAllDiscounts;
  }

  // getBrands() {
  //   this.productService.getAllProducts().subscribe((res) => {
  //     this.products = res.filter((product) => {
  //       const categoryId = Number(this.categoryId);
  //       const subCategoryId = Number(this.subCategoryId);
  //       const parentId = Number(this.parentId);

  //       if (categoryId !== 0 && product.category[0].id !== categoryId) {
  //         return false;
  //       }

  //       if (
  //         subCategoryId !== 0 &&
  //         product.subCategory[0].id !== subCategoryId
  //       ) {
  //         return false;
  //       }

  //       if (parentId !== 0 && product.parentCategory[0].id !== parentId) {
  //         return false;
  //       }

  //       return true;
  //     });

  //     const uniqueBrands = Array.from(
  //       new Set(
  //         this.products.map((product) => JSON.stringify(product.brand[0]))
  //       )
  //     ).map((brandStr) => JSON.parse(brandStr));

  //     this.brands = uniqueBrands;
  //   });
  // }
}
