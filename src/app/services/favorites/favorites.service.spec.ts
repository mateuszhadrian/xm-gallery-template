import { TestBed } from '@angular/core/testing';

import { FavoritesService } from './favorites.service';
import { Photo } from '../../interfaces/photo.interface';

const photoExample: Photo = {
  id: '10',
  author: 'John',
  url: 'https://picsum.photos/id/10/300/400',
};

describe('FavoritesService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [FavoritesService],
    });
  });

  it('should fetch empty array when local storage is empty', () => {
    const service = TestBed.inject(FavoritesService);
    expect(service.favorites()).toEqual([]);
  });

  it('should add photo and save it to local storage', () => {
    const service = TestBed.inject(FavoritesService);
    service.add(photoExample);
    expect(service.isFavorite(photoExample.id)).toBe(true);
    expect(JSON.parse(localStorage.getItem('favorites')!)).toContainEqual(photoExample);
  });

  it('should not add to favorites twice', () => {
    const service = TestBed.inject(FavoritesService);
    service.add(photoExample);
    service.add(photoExample);
    expect(service.favorites().length).toBe(1);
  });

  it('removes photo from favorites', () => {
    const service = TestBed.inject(FavoritesService);
    service.add(photoExample);
    service.remove(photoExample.id);
    expect(service.isFavorite(photoExample.id)).toBe(false);
  });

  it('retrieves favorites from local storage on initialization', () => {
    localStorage.setItem('favorites', JSON.stringify([photoExample]));
    const service = TestBed.inject(FavoritesService);
    expect(service.isFavorite(photoExample.id)).toBe(true);
  });
});
