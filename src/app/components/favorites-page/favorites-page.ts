import { Component, inject } from '@angular/core';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { PhotoGrid } from '../photo-grid/photo-grid';

@Component({
  selector: 'app-favorites-page',
  imports: [PhotoGrid],
  templateUrl: './favorites-page.html',
  styleUrl: './favorites-page.scss',
})
export class FavoritesPage {
  readonly favorites = inject(FavoritesService);
}
