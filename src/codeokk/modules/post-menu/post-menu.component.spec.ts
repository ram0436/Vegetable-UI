import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostMenuComponent } from './post-menu.component';

describe('PostMenuComponent', () => {
  let component: PostMenuComponent;
  let fixture: ComponentFixture<PostMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
