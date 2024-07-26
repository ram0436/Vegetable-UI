import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private searchResultsSubject = new BehaviorSubject<any[]>([]);
  private getAllItemsSubject = new BehaviorSubject<any[]>([]);
  public searchResults$ = this.searchResultsSubject.asObservable();
  public getAllItems$ = this.getAllItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    // this.loadFromLocalStorage();
  }
  private BaseURL = environment.baseUrl;

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BaseURL}Product/GetAllProduct`).pipe(
      tap((results) => {
        this.getAllItemsSubject.next(results);
      })
    );
  }

  getAllColors() {
    return this.http.get<any[]>(`${this.BaseURL}Master/GetAllColor`);
  }

  getProductByProductCode(code: any) {
    return this.http.get(
      `${this.BaseURL}Product/GetProductByProductCode?productCode=` + code
    );
  }

  getProductByProductId(id: any) {
    return this.http.get(
      `${this.BaseURL}Product/GetProductByProductId?productId=${id}`
    );
  }

  deleteProduct(id: any) {
    return this.http.delete(`${this.BaseURL}Product/${id}`);
  }

  uploadProjectCodeImages(formData: any) {
    return this.http.post(`${this.BaseURL}Product/UploadImages`, formData);
  }

  saveProjectCodePost(payLoad: any) {
    return this.http.post(`${this.BaseURL}Product`, payLoad);
  }

  updateProjectCodePost(productId: any, payLoad: any) {
    return this.http.put(`${this.BaseURL}Product/${productId}`, payLoad);
  }

  searchAds(searchQuery: string): Observable<any[]> {
    const apiUrl = `${this.BaseURL}Product/GlobalSearch?searchItem=${searchQuery}`;
    return this.http.get<any[]>(apiUrl).pipe(
      tap((results) => {
        this.searchResultsSubject.next(results);
      })
    );
  }

  getAppColor() {
    return this.http.get<any[]>(`${this.BaseURL}Master/GetAllColor`);
  }

  getProductSizebyProductId(productId: number) {
    return this.http.get<any[]>(
      `${this.BaseURL}Product/GetProductSizeByProductId?productId=${productId}`
    );
  }
}
