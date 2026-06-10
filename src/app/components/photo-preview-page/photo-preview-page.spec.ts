import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoPreviewPage } from './photo-preview-page';

describe('PhotoPreviewPage', () => {
  let component: PhotoPreviewPage;
  let fixture: ComponentFixture<PhotoPreviewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoPreviewPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoPreviewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
