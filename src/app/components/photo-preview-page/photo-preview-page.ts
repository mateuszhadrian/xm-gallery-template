import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatFabButton } from '@angular/material/button';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { Photo } from '../../interfaces/photo.interface';

@Component({
  selector: 'app-photo-preview-page',
  imports: [MatFabButton],
  templateUrl: './photo-preview-page.html',
  styleUrl: './photo-preview-page.scss',
})
export class PhotoPreviewPage {
  private route = inject(ActivatedRoute);
  private favorites = inject(FavoritesService);

  readonly photo = signal<Photo | undefined>(undefined);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    const fromStore = this.favorites.favorites().find((p) => p.id === id);
    this.photo.set(fromStore);
  }
}
