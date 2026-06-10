import { afterNextRender, Component, ElementRef, input, output, viewChild } from '@angular/core';
import { Photo } from '../../interfaces/photo.interface';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-photo-grid',
  imports: [MatProgressSpinner],
  templateUrl: './photo-grid.html',
  styleUrl: './photo-grid.scss',
})
export class PhotoGrid {
  readonly photos = input.required<Photo[]>();
  readonly infiniteScroll = input(false);
  readonly loading = input(false);

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
    });
  }
}
