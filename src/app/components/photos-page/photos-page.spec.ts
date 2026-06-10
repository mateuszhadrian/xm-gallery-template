import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosPage } from './photos-page';

describe('PhotosPage', () => {
  let component: PhotosPage;
  let fixture: ComponentFixture<PhotosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotosPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotosPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
