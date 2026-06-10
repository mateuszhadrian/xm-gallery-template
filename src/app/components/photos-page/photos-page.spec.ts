import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Observable, of, Subject } from 'rxjs';

import { PhotosPage } from './photos-page';
import { PhotoApiService } from '../../services/photo-api/photo-api.service';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { Photo } from '../../interfaces/photo.interface';

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

let observerCallback: IntersectionObserverCallback;

class MockIntersectionObserver {
  constructor(cb: IntersectionObserverCallback) {
    observerCallback = cb;
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

function fireIntersection(isIntersecting: boolean): void {
  observerCallback([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver);
}

describe('PhotosPage', () => {
  let api: FakePhotoApiService;
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    TestBed.configureTestingModule({
      imports: [PhotosPage],
      providers: [
        { provide: PhotoApiService, useClass: FakePhotoApiService },
        { provide: FavoritesService, useClass: FakeFavoritesService },
      ],
    });

    api = TestBed.inject(PhotoApiService) as unknown as FakePhotoApiService;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads the first page of photos on initialization', async () => {
    api.getPhotoList.mockReturnValue(of([photoFactory('10'), photoFactory('20')]));

    const fixture = TestBed.createComponent(PhotosPage);
    await fixture.whenStable();

    expect(api.getPhotoList).toHaveBeenCalledWith(1);
    expect(fixture.nativeElement.querySelectorAll('.tile').length).toBe(2);
  });

  it('shows the loader while loading and hides it once photos arrive', async () => {
    const stream = new Subject<Photo[]>();
    api.getPhotoList.mockReturnValue(stream.asObservable());

    const fixture = TestBed.createComponent(PhotosPage);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.loader')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.tile').length).toBe(0);

    stream.next([photoFactory('10')]);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.loader')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('.tile').length).toBe(1);
  });

  it('loads the next page when the sentinel enters the viewport', async () => {
    api.getPhotoList.mockReturnValue(of([photoFactory('10')]));

    const fixture = TestBed.createComponent(PhotosPage);
    await fixture.whenStable();

    expect(api.getPhotoList).toHaveBeenCalledWith(1);

    fireIntersection(true);

    expect(api.getPhotoList).toHaveBeenCalledWith(2);
    expect(api.getPhotoList).toHaveBeenCalledTimes(2);
  });
});
