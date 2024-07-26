import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredPostsComponent } from './filtered-posts.component';

describe('FilteredPostsComponent', () => {
  let component: FilteredPostsComponent;
  let fixture: ComponentFixture<FilteredPostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilteredPostsComponent]
    });
    fixture = TestBed.createComponent(FilteredPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
