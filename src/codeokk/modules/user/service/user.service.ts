import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private dataSubject = new Subject<any>();
  private userData: any = [];

  private baseUrl = environment.baseUrl;

  private userName: string = "";
  private mobileNo: string = "";

  private userDataKey = "userData";

  private priceDetailsKey = "priceDetails";

  private _selectedCount: number = 0;
  private _totalMRP: number = 0;
  private _totalDiscount: number = 0;
  private _totalAmount: number = 0;
  private _orderDetails: any[] = [];

  private placeOrderSubject = new Subject<void>();

  placeOrder$ = this.placeOrderSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    this.loadFromLocalStorage();
  }

  triggerPlaceOrder() {
    this.placeOrderSubject.next();
  }

  get selectedCount(): number {
    return this._selectedCount;
  }

  set selectedCount(value: number) {
    this._selectedCount = value;
    this.saveToLocalStorage();
  }

  get orderDetails(): any {
    return this._orderDetails;
  }

  set orderDetails(value: any) {
    this._orderDetails = value;
    this.saveToLocalStorage();
  }

  get totalMRP(): number {
    return this._totalMRP;
  }

  set totalMRP(value: number) {
    this._totalMRP = value;
    this.saveToLocalStorage();
  }

  get totalDiscount(): number {
    return this._totalDiscount;
  }

  set totalDiscount(value: number) {
    this._totalDiscount = value;
    this.saveToLocalStorage();
  }

  get totalAmount(): number {
    return this._totalAmount;
  }

  set totalAmount(value: number) {
    this._totalAmount = value;
    this.saveToLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem(
      "cart",
      JSON.stringify({
        selectedCount: this._selectedCount,
        totalMRP: this._totalMRP,
        totalDiscount: this._totalDiscount,
        totalAmount: this._totalAmount,
      })
    );
    localStorage.setItem(
      "orderDetails",
      JSON.stringify({
        details: this._orderDetails,
      })
    );
  }

  private loadFromLocalStorage() {
    const cartString = localStorage.getItem("cart");
    if (cartString) {
      const cart = JSON.parse(cartString);
      this._selectedCount = cart.selectedCount;
      this._totalMRP = cart.totalMRP;
      this._totalDiscount = cart.totalDiscount;
      this._totalAmount = cart.totalAmount;
    }
    const orderDetailsStrin = localStorage.getItem("orderDetails");
    if (orderDetailsStrin) {
      const orderDetails = JSON.parse(orderDetailsStrin);
      this._orderDetails = orderDetails.details;
    }
  }

  setPriceDetails(
    selectedCount: number,
    totalMRP: number,
    totalDiscount: number,
    totalAmount: number
  ) {
    this.selectedCount = selectedCount;
    this.totalMRP = totalMRP;
    this.totalDiscount = totalDiscount;
    this.totalAmount = totalAmount;
  }

  getPriceDetails() {
    return {
      selectedCount: this.selectedCount,
      totalMRP: this.totalMRP,
      totalDiscount: this.totalDiscount,
      totalAmount: this.totalAmount,
    };
  }

  setUserData(data: { name: string; mobile: string }) {
    localStorage.setItem(this.userDataKey, JSON.stringify(data));
  }

  getUserData() {
    const userDataString = localStorage.getItem(this.userDataKey);
    if (userDataString) {
      return JSON.parse(userDataString);
    }
    return null;
  }

  getAddress(pinCode: any) {
    return this.httpClient.get(
      "https://api.postalpincode.in/pincode/" + pinCode
    );
  }

  saveAddress(payload: any) {
    return this.httpClient.post(`${this.baseUrl}User/SaveAddress`, payload);
  }

  getProductImageByProductId(id: any) {
    return this.httpClient.get(
      `${this.baseUrl}User/GetProductImageByProductId?productId=${id}`
    );
  }

  setData(data: any) {
    this.dataSubject.next(data);
  }

  addWishList(payload: any) {
    return this.httpClient.post(`${this.baseUrl}User/AddWishList`, payload);
  }

  addToCart(payload: any) {
    return this.httpClient.post(`${this.baseUrl}User/AddToCart`, payload);
  }

  createOrder(payload: any) {
    return this.httpClient.post(`${this.baseUrl}User/CreateOrder`, payload);
  }

  getOrderByUserId(userId: any) {
    return this.httpClient.get(
      `${this.baseUrl}User/GetOrderByUserId?userId=${userId}`
    );
  }

  getAllOrders() {
    return this.httpClient.get(`${this.baseUrl}User/GetAllOrder`);
  }

  removeItemFromCart(cartId: any, userId: any) {
    return this.httpClient.delete(
      `${this.baseUrl}User/RemoveCartById?cartId=${cartId}&loggedInUserId=${userId}`
    );
  }

  removeItemFromWishlist(cartId: any, userId: any) {
    return this.httpClient.delete(
      `${this.baseUrl}User/RemoveWishlisttById?cartId=${cartId}&loggedInUserId=${userId}`
    );
  }

  getWishListByUserId(userId: any) {
    return this.httpClient.get(
      `${this.baseUrl}User/GetWishListByUserId?userId=${userId}`
    );
  }

  getAddressByUserId(userId: any) {
    return this.httpClient.get(
      `${this.baseUrl}User/GetAddressByUserId?userId=${userId}`
    );
  }

  removeAddressById(id: any) {
    return this.httpClient.delete(
      `${this.baseUrl}User/RemoveAddressById?addressId=${id}`
    );
  }

  getCartItemByUserId(userId: any) {
    return this.httpClient.get(
      `${this.baseUrl}User/GetCartItemByUserId?userId=${userId}`
    );
  }

  GetRatingReviewByProductId(userId: any) {
    return this.httpClient.get(
      `${this.baseUrl}User/GetRatingReviewByProductId?productId=${userId}`
    );
  }

  addUserReview(payload: any) {
    return this.httpClient.post(`${this.baseUrl}User/AddRatingReview`, payload);
  }

  sendLoginOTP(
    mobileNumber: string,
    ipAddress: string,
    createdOn: string
  ): Observable<any> {
    const url = `${this.baseUrl}Auth/SendLoginOTP`;
    const body = {
      mobile: mobileNumber,
      ipAddress: ipAddress,
      createdOn: createdOn,
    };
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.httpClient.post(url, body, { headers: headers });
  }

  OTPLogin(mobileNo: string, otp: number, firstName: string): Observable<any> {
    const url = `${this.baseUrl}Auth/OTPLogin?mobileNo=${mobileNo}&otp=${otp}&firstName=${firstName}`;
    return this.httpClient.post(url, null, {
      headers: new HttpHeaders({
        Accept: "*/*",
      }),
    });
  }
}
