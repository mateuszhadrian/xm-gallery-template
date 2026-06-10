import { inject, Service } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { Photo } from '../../interfaces/photo.interface';
import { HttpClient } from '@angular/common/http';
import { PicsumListItem } from '../../interfaces/picsum-list-item.interface';

@Service()
export class PhotoApiService {
  private http: HttpClient = inject(HttpClient);
  private static readonly PAGE_SIZE = 12;

  getPhotoList(pageNumber: number): Observable<Photo[]> {
    const url = `https://picsum.photos/v2/list?page=${pageNumber}&limit=${PhotoApiService.PAGE_SIZE}`;
    const delayMs = 200 + Math.floor(Math.random() * 101);
    return this.http.get<PicsumListItem[]>(url).pipe(
      delay(delayMs),
      map((items) => items.map((item) => this.mapToPhoto(item))),
    );
  }

  private mapToPhoto(item: PicsumListItem): Photo {
    return {
      id: item.id,
      author: item.author,
      url: item.download_url,
    };
  }
}
