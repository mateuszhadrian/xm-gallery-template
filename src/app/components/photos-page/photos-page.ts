import { Component, inject, signal } from '@angular/core';
import { Photo } from '../../interfaces/photo.interface';
import { PhotoApiService } from '../../services/photo-api/photo-api.service';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { PhotoGrid } from '../photo-grid/photo-grid';

@Component({
  selector: 'app-photos-page',
  imports: [PhotoGrid],
  templateUrl: './photos-page.html',
  styleUrl: './photos-page.scss',
})
export class PhotosPage {
  private api = inject(PhotoApiService);
  private favorites = inject(FavoritesService);

  readonly photos = signal<Photo[]>([]);
  readonly loading = signal(false);
  private currentPageNumber = 1;

  constructor() {
    this.loadNext();
  }

  loadNext(): void {
    this.loading.set(true);

    this.api.getPhotoList(this.currentPageNumber).subscribe((batch) => {
      this.photos.update((list) => [...list, ...batch]);
      this.currentPageNumber++;
      this.loading.set(false);
    });
  }

  onPhotoClick(photo: Photo): void {
    this.favorites.add(photo);
  }
}
