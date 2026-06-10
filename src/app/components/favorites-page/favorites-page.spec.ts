import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

import { FavoritesPage } from './favorites-page';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { Photo } from '../../interfaces/photo.interface';

const photoFactory = (id: string): Photo => ({
  id,
  author: `Author ${id}`,
  url: `https://picsum.photos/id/${id}/200/300`,
});

class FakeFavoritesService {
  readonly favorites = signal<Photo[]>([]);
  add = vi.fn<(photo: Photo) => void>();
  remove = vi.fn<(photo: Photo) => void>();
  isFavorite = vi.fn((_id: string): boolean => false);
}

describe('FavoritesPage', () => {
  let favorites: FakeFavoritesService;
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    router = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      imports: [FavoritesPage],
      providers: [
        { provide: FavoritesService, useClass: FakeFavoritesService },
        { provide: Router, useValue: router },
      ],
    });

    favorites = TestBed.inject(FavoritesService) as unknown as FakeFavoritesService;
  });

  it('should create', async () => {
    const fixture = TestBed.createComponent(FavoritesPage);
    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders one tile per favorite photo', async () => {
    favorites.favorites.set([photoFactory('10'), photoFactory('20')]);

    const fixture = TestBed.createComponent(FavoritesPage);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('.tile').length).toBe(2);
  });

  it('does not render an infinite-scroll sentinel', async () => {
    favorites.favorites.set([photoFactory('10')]);

    const fixture = TestBed.createComponent(FavoritesPage);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.sentinel')).toBeNull();
  });
});
