import { Service, signal } from '@angular/core';
import { Photo } from '../../interfaces/photo.interface';

@Service()
export class FavoritesService {
  private readonly _favorites = signal<Photo[]>(
    JSON.parse(localStorage.getItem('favorites') ?? '[]'),
  );

  readonly favorites = this._favorites.asReadonly();

  isFavorite(photoId: string): boolean {
    return this._favorites().some((photo) => photo.id === photoId);
  }
}
