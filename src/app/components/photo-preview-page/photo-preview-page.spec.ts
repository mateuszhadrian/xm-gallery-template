import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import { PhotoApiService } from '../../services/photo-api/photo-api.service';

import { FavoritesService } from '../../services/favorites/favorites.service';
import { Photo } from '../../interfaces/photo.interface';
import { PhotoPreviewPage } from './photo-preview-page';

const photo = (id: string): Photo => ({
  id,
  author: `Author ${id}`,
  url: `https://picsum.photos/id/${id}/200/300`,
});

class FakePhotoApiService {
  getPhotos = vi.fn(() => of<Photo[]>([]));
  getPhoto = vi.fn((id: string): Observable<Photo> => of(photo(id)));
}

class FakeFavoritesService {
  favorites = signal<Photo[]>([]); // store ulubionych (sygnał, jak w prawdziwym serwisie)
  add = vi.fn();
  remove = vi.fn();
  isFavorite = vi.fn(() => false);
}

describe('PhotoPreviewPage', () => {
  let api: FakePhotoApiService;
  let favorites: FakeFavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PhotoPreviewPage],
      providers: [
        provideRouter([{ path: 'favorites', children: [] }]),
        { provide: PhotoApiService, useClass: FakePhotoApiService },
        { provide: FavoritesService, useClass: FakeFavoritesService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '10' }) } },
        },
      ],
    });

    api = TestBed.inject(PhotoApiService) as unknown as FakePhotoApiService;
    favorites = TestBed.inject(FavoritesService) as unknown as FakeFavoritesService;
  });

  it('shows the photo from the store without calling the API', () => {
    const stored = photo('10');
    favorites.favorites.set([stored]);

    const page = TestBed.createComponent(PhotoPreviewPage).componentInstance;

    expect(page.photo()).toEqual(stored);
    expect(api.getPhoto).not.toHaveBeenCalled();
  });
});
