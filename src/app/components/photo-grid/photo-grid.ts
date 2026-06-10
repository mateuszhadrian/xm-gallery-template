import { afterNextRender, Component, input, output } from '@angular/core';
import { Photo } from '../../interfaces/photo.interface';

@Component({
  selector: 'app-photo-grid',
  templateUrl: './photo-grid.html',
  styleUrl: './photo-grid.scss',
})
export class PhotoGrid {
  readonly photos = input.required<Photo[]>();
  readonly loadPhotos = output<void>();

  constructor() {
    afterNextRender(() => {
      this.loadPhotos.emit();
    });
  }
}
