import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-try-at-home",
  templateUrl: "./try-at-home.component.html",
  styleUrls: ["./try-at-home.component.css"],
})
export class TryAtHomeComponent implements OnInit {
  rooms = [
    { name: "Living Room", image: "assets/rooms/living-room.jpeg" },
    { name: "Bedroom", image: "assets/rooms/bedroom.jpg" },
    { name: "Office", image: "assets/rooms/office.jpg" },
  ];

  carpetImageUrl: string = "";

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.carpetImageUrl = params["imageUrl"];
    });
  }

  selectRoom(roomImage: string) {
    this.router.navigate(["/ar-view"], {
      queryParams: { roomImage, carpetImage: this.carpetImageUrl },
    });
  }
}
