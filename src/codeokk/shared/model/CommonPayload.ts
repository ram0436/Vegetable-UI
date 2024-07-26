export class Common {
  productName: string = "";
  productDescription: string = "";
  productParentCategoryId: number = 0;
  productCategoryId: number = 0;
  productSubCategoryId: number = 0;
  productBrandId: number = 0;
  productColorId: number = 0;
  productSizeId: number = 0;
  productCode: string = "";
  productPrice: number = 0;
  tags: any[] = [];
  inStock: boolean = true;
  productImageList: { id: number; imageURL: any }[] = [];
  selectedDiscountId: number | null = 0;
  productSizeMappingsList: any[] = [];
}
