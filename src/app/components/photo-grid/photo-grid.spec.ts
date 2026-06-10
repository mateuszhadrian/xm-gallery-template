import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PhotoGrid } from './photo-grid';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { Photo } from '../../interfaces/photo.interface';

const photoFactory = (id: string): Photo => ({
  id,
  author: `Author ${id}`,
  url: `https://picsum.photos/id/${id}/200/300`,
});

class FakeFavoritesService {
  add = vi.fn<(photo: Photo) => void>();
  remove = vi.fn<(photo: Photo) => void>();
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

describe('PhotoGrid', () => {
  beforeEach(() => {
    observerCallback = undefined as unknown as IntersectionObserverCallback;
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    TestBed.configureTestingModule({
      imports: [PhotoGrid],
      providers: [{ provide: FavoritesService, useClass: FakeFavoritesService }],
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders one tile per photo', async () => {
    const fixture = TestBed.createComponent(PhotoGrid);
    fixture.componentRef.setInput('photos', [photoFactory('10'), photoFactory('20')]);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('.tile').length).toBe(2);
  });

  it('emits photoClick with the photo when a tile is clicked', async () => {
    const photo = photoFactory('10');
    const fixture = TestBed.createComponent(PhotoGrid);
    fixture.componentRef.setInput('photos', [photo]);
    await fixture.whenStable();

    const clicked: Photo[] = [];
    fixture.componentInstance.photoClick.subscribe((p) => clicked.push(p));

    fixture.debugElement.query(By.css('.tile')).triggerEventHandler('click', null);

    expect(clicked).toEqual([photo]);
  });

  it('shows the loader only when loading is true', async () => {
    const fixture = TestBed.createComponent(PhotoGrid);
    fixture.componentRef.setInput('photos', []);
    fixture.componentRef.setInput('loading', false);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.loader')).toBeNull();

    fixture.componentRef.setInput('loading', true);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.loader')).toBeTruthy();
  });

  it('does not render a sentinel and never emits loadMore when infiniteScroll is false', async () => {
    const fixture = TestBed.createComponent(PhotoGrid);
    fixture.componentRef.setInput('photos', [photoFactory('10')]);
    fixture.componentRef.setInput('infiniteScroll', false);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.sentinel')).toBeNull();
    expect(observerCallback).toBeUndefined();
  });

  it('emits loadMore when the sentinel intersects and infiniteScroll is true', async () => {
    const fixture = TestBed.createComponent(PhotoGrid);
    fixture.componentRef.setInput('photos', [photoFactory('10')]);
    fixture.componentRef.setInput('infiniteScroll', true);
    await fixture.whenStable();

    const loadMore = vi.fn();
    fixture.componentInstance.loadMore.subscribe(loadMore);

    expect(fixture.nativeElement.querySelector('.sentinel')).toBeTruthy();

    fireIntersection(true);

    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  it('does not emit loadMore while loading', async () => {
    const fixture = TestBed.createComponent(PhotoGrid);
    fixture.componentRef.setInput('photos', [photoFactory('10')]);
    fixture.componentRef.setInput('infiniteScroll', true);
    fixture.componentRef.setInput('loading', true);
    await fixture.whenStable();

    const loadMore = vi.fn();
    fixture.componentInstance.loadMore.subscribe(loadMore);

    fireIntersection(true);

    expect(loadMore).not.toHaveBeenCalled();
  });
});
