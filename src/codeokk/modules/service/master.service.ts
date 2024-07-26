import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MasterService {
  private dataSubject = new Subject<any>();

  private brandsDataSubject = new Subject<any>();

  constructor(private http: HttpClient) {}

  private baseUrl = environment.baseUrl;

  getAllParentCategories() {
    return this.http.get(`${this.baseUrl}Master/GetAllParentCategory`);
  }

  getAllBrands() {
    return this.http.get(`${this.baseUrl}Master/GetAllBrand`);
  }

  getAllColors() {
    return this.http.get(`${this.baseUrl}Master/GetAllColor`);
  }

  getAllDiscount() {
    return this.http.get(`${this.baseUrl}Master/GetAllDiscount`);
  }

  getAllProductSize() {
    return this.http.get(`${this.baseUrl}Master/GetAllProductSize`);
  }

  getBrandBySubCategoryId(subCategoryId: number) {
    return this.http.get(
      `${this.baseUrl}/Master/GetBrandBySubCategoryId?subCategoryId=${subCategoryId}`
    );
  }

  removeParentCategory(parentCategoryId: number) {
    return this.http.delete(
      `${this.baseUrl}Master/RemoveParentCategoryId?parentCategoryId=${parentCategoryId}`
    );
  }

  removeCategory(categoryId: number) {
    return this.http.delete(
      `${this.baseUrl}Master/RemoveCategoryId?categoryId=${categoryId}`
    );
  }

  removeSubCategory(subCategoryId: number) {
    return this.http.delete(
      `${this.baseUrl}Master/RemoveSubCategoryById?subCategoryId=${subCategoryId}`
    );
  }

  getBrandByCategoryId(categoryId: number) {
    return this.http.get(
      `${this.baseUrl}/Master/GetBrandByCategoryId?categoryId=${categoryId}`
    );
  }

  getAllColorBySubCategoryId(subCategoryId: number) {
    return this.http.get(
      `${this.baseUrl}/Master/GetAllColorBySubCategoryId?subCategoryId=${subCategoryId}`
    );
  }

  getAllDiscountBySubCategoryId(subCategoryId: number) {
    return this.http.get(
      `${this.baseUrl}Master/GetAllDiscountBySubCategoryId?subCategoryId=${subCategoryId}`
    );
  }

  getAllColorByCategoryId(categoryId: number) {
    return this.http.get(
      `${this.baseUrl}Master/GetAllColorByCategoryId?categoryId=${categoryId}`
    );
  }

  getAllDiscountByCategoryId(categoryId: number) {
    return this.http.get(
      `${this.baseUrl}Master/GetAllDiscountByCategoryId?categoryId=${categoryId}`
    );
  }

  getCategoryByParentCategoryId(parentCategoryId: number) {
    return this.http.get(
      `${this.baseUrl}Master/GetCategoryByParentCategoryId?parentCategoryId=${parentCategoryId}`
    );
  }

  getSubCategoryByCategoryId(categoryId: number) {
    return this.http.get(
      `${this.baseUrl}Master/GetSubCategoryByCategoryId?CategoryId=${categoryId}`
    );
  }

  addBrand(payload: any) {
    return this.http.post(`${this.baseUrl}Master/AddBrand`, payload);
  }

  addParentCategory(payload: any) {
    return this.http.post(`${this.baseUrl}Master/AddParentCategory`, payload);
  }

  addCategory(payload: any) {
    return this.http.post(`${this.baseUrl}Master/AddCategory`, payload);
  }

  addSubCategory(payload: any) {
    return this.http.post(`${this.baseUrl}Master/AddSubCategory`, payload);
  }

  addColor(payload: any) {
    return this.http.post(`${this.baseUrl}Master/AddColor`, payload);
  }

  setData(data: any) {
    this.dataSubject.next(data);
  }

  setBrandsData(data: any) {
    this.brandsDataSubject.next(data);
  }

  getData() {
    return this.dataSubject.asObservable();
  }

  getBrandsData() {
    return this.brandsDataSubject.asObservable();
  }
}
