import { Service, signal } from '@angular/core';
import { Photo } from '../../interfaces/photo.interface';

@Service()
export class FavoritesService {
  private static readonly localStorageKey = 'favorites';
  private readonly _favorites = signal<Photo[]>(this.getFavoritesFromLocalStorage());

  readonly favorites = this._favorites.asReadonly();

  add(photo: Photo) {
    if (this.isFavorite(photo.id)) return;
    this._favorites.update((favorites) => [...favorites, photo]);
    this.setInLocalStorage();
  }

  remove(photoId: string) {
    this._favorites.update((favorites) => favorites.filter((favorite) => favorite.id !== photoId));
    this.setInLocalStorage();
  }

  isFavorite(photoId: string): boolean {
    return this._favorites().some((photo) => photo.id === photoId);
  }

  private setInLocalStorage() {
    localStorage.setItem(FavoritesService.localStorageKey, JSON.stringify(this._favorites()));
  }

  private getFavoritesFromLocalStorage() {
    try {
      return JSON.parse(localStorage.getItem(FavoritesService.localStorageKey) ?? '[]');
    } catch {
      return [];
    }
  }
}
