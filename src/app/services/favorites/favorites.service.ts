import { Service, signal } from '@angular/core';
import { Photo } from '../../interfaces/photo.interface';

@Service()
export class FavoritesService {
  private static readonly localStorageKey = 'favorites';
  private readonly _favorites = signal<Photo[]>(
    JSON.parse(localStorage.getItem(FavoritesService.localStorageKey) ?? '[]'),
  );

  readonly favorites = this._favorites.asReadonly();

  add(photo: Photo) {
    if (this.isFavorite(photo.id)) return;
    this._favorites.update((favorites) => [...favorites, photo]);
    localStorage.setItem(FavoritesService.localStorageKey, JSON.stringify(this._favorites()));
  }

  isFavorite(photoId: string): boolean {
    return this._favorites().some((photo) => photo.id === photoId);
  }
}
