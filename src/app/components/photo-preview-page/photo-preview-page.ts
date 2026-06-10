import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFabButton } from '@angular/material/button';
import { PhotoApiService } from '../../services/photo-api/photo-api.service';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { Photo } from '../../interfaces/photo.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-photo-preview-page',
  imports: [MatFabButton],
  templateUrl: './photo-preview-page.html',
  styleUrl: './photo-preview-page.scss',
})
export class PhotoPreviewPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(PhotoApiService);
  private favorites = inject(FavoritesService);

  readonly photo = signal<Photo | undefined>(undefined);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    const fromStore = this.favorites.favorites().find((p) => p.id === id);
    if (fromStore) {
      this.photo.set(fromStore);
    } else {
      this.api
        .getPhoto(id)
        .pipe(takeUntilDestroyed())
        .subscribe((p) => this.photo.set(p));
    }
  }

  removeFromFavorites(id: string): void {
    this.favorites.remove(id);
    this.router.navigate(['/favorites']);
  }
}
