import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { Photo } from '../../interfaces/photo.interface';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-photo-grid',
  imports: [MatIcon, MatProgressSpinner],
  templateUrl: './photo-grid.html',
  styleUrl: './photo-grid.scss',
})
export class PhotoGrid {
  private favorites = inject(FavoritesService);
  private destroyRef = inject(DestroyRef);

  readonly photos = input.required<Photo[]>();
  readonly infiniteScroll = input(false);
  readonly loading = input(false);

  readonly photoClick = output<Photo>();
  readonly loadMore = output<void>();

  private sentinel = viewChild<ElementRef<HTMLElement>>('sentinel');
  private scrollContainer = viewChild.required<ElementRef<HTMLElement>>('scrollContainer');

  constructor() {
    afterNextRender(() => {
      if (!this.infiniteScroll()) return;

      const sentinel = this.sentinel();
      if (!sentinel) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !this.loading()) this.loadMore.emit();
        },
        {
          root: this.scrollContainer().nativeElement,
        },
      );
      observer.observe(sentinel.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  isFavorite = (id: string) => this.favorites.isFavorite(id);
}
