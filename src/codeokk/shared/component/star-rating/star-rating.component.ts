import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";

@Component({
  selector: "app-star-rating",
  templateUrl: "./star-rating.component.html",
  styleUrls: ["./star-rating.component.css"],
})
export class StarRatingComponent implements OnInit {
  @Input() maxRating = 5;
  @Input() selectedStar = 0;
  @Input() currentRating: any;
  @Input() allStarsChecked = false;
  @Input() readOnly = false;
  @Output() ratingClicked: EventEmitter<number> = new EventEmitter<number>();
  @Output() onRating: EventEmitter<number> = new EventEmitter<number>();

  @Output() ratingSelected: EventEmitter<number> = new EventEmitter<number>();

  maxRatingArr: any = [];
  previousSelection = 0;

  stars: { filled: boolean; value: number }[] = [];

  constructor() {}

  ngOnInit() {
    this.maxRatingArr = Array(this.maxRating).fill(0);
    if (this.allStarsChecked) {
      this.selectedStar = this.maxRating;
    }
  }

  HandleMouseEnter(index: number) {
    if (!this.readOnly) {
      this.selectedStar = index + 1;
    }
  }

  HandleMouseLeave() {
    if (!this.readOnly) {
      if (this.previousSelection !== 0) {
        this.selectedStar = this.previousSelection;
      } else {
        this.selectedStar = 0;
      }
    }
  }

  getSelectedStar(index: number): string {
    const roundedRating = Math.round(this.selectedStar * 2) / 2;
    if (roundedRating >= index + 1) {
      return "star";
    } else if (roundedRating >= index + 0.5) {
      return "star_half";
    } else {
      return "star_outline";
    }
  }

  Rating(index: number) {
    if (!this.readOnly) {
      this.selectedStar = index + 1;
      this.previousSelection = this.selectedStar;
      this.onRating.emit(this.selectedStar + 1);
      this.ratingSelected.emit(this.selectedStar);
    }
  }
}
