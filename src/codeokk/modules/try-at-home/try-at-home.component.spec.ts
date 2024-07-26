import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TryAtHomeComponent } from './try-at-home.component';

describe('TryAtHomeComponent', () => {
  let component: TryAtHomeComponent;
  let fixture: ComponentFixture<TryAtHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TryAtHomeComponent]
    });
    fixture = TestBed.createComponent(TryAtHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
