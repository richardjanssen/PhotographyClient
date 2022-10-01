import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosOverviewComponent } from './photos-overview.component';

describe('PhotosOverviewComponent', () => {
  let component: PhotosOverviewComponent;
  let fixture: ComponentFixture<PhotosOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotosOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotosOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
