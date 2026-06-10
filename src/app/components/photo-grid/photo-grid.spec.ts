import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { PhotoApiService } from '../../services/photo-api/photo-api.service';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { Photo } from '../../interfaces/photo.interface';
import { PhotosPage } from '../photos-page/photos-page';

const photoFactory = (id: string): Photo => ({
  id,
  author: `Author ${id}`,
  url: `https://picsum.photos/id/${id}/200/300`,
});

class FakePhotoApiService {
  getPhotoList = vi.fn((_pageNumber: number): Observable<Photo[]> => of([]));
  getPhoto = vi.fn((id: string): Observable<Photo> => of(photoFactory(id)));
}

class FakeFavoritesService {
  add = vi.fn<(photo: Photo) => void>();
  remove = vi.fn<(id: string) => void>();
  isFavorite = vi.fn((_id: string): boolean => false);
}

describe('PhotosPage', () => {
  let api: FakePhotoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PhotosPage],
      providers: [
        { provide: PhotoApiService, useClass: FakePhotoApiService },
        { provide: FavoritesService, useClass: FakeFavoritesService },
      ],
    });

    api = TestBed.inject(PhotoApiService) as unknown as FakePhotoApiService;
  });

  it('loads the first page of photos on initialization', async () => {
    api.getPhotoList.mockReturnValue(of([photoFactory('10'), photoFactory('20')]));

    const fixture = TestBed.createComponent(PhotosPage);
    await fixture.whenStable();

    expect(api.getPhotoList).toHaveBeenCalledWith(1);
    expect(fixture.nativeElement.querySelectorAll('.tile').length).toBe(2);
  });
});
