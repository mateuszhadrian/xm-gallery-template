import { Component, inject, signal } from '@angular/core';
import { Photo } from '../../interfaces/photo.interface';
import { PhotoApiService } from '../../services/photo-api/photo-api.service';
import { PhotoGrid } from '../photo-grid/photo-grid';

@Component({
  selector: 'app-photos-page',
  imports: [PhotoGrid],
  templateUrl: './photos-page.html',
  styleUrl: './photos-page.scss',
})
export class PhotosPage {
  private api = inject(PhotoApiService);
  readonly photos = signal<Photo[]>([]);

  loadNext(): void {
    this.api.getPhotoList(1).subscribe((batch) => {
      this.photos.update((list) => [...list, ...batch]);
    });
  }
}
