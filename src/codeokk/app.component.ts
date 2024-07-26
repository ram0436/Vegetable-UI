import { Component } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { ProductService } from "./shared/service/product.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "Generic-App";
  showHeaderAndFooter: boolean = true;

  constructor(private router: Router, private productService: ProductService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showHeaderAndFooter = !event.url.includes("/account");
      }
    });
  }

  ngOnInit(): void {
    this.productService.getAppColor().subscribe((response: any) => {
      document.documentElement.style.setProperty(
        "--dynamic-app-color",
        "#008000"
      );
    });
  }
}
