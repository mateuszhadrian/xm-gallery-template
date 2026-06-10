import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Photo } from '../../interfaces/photo.interface';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { PhotoGrid } from '../photo-grid/photo-grid';

@Component({
  selector: 'app-favorites-page',
  imports: [PhotoGrid],
  templateUrl: './favorites-page.html',
  styleUrl: './favorites-page.scss',
})
export class FavoritesPage {
  private router = inject(Router);
  readonly favorites = inject(FavoritesService);

  onPhotoClick(photo: Photo): void {
    this.router.navigate(['/photos', photo.id]);
  }
}
