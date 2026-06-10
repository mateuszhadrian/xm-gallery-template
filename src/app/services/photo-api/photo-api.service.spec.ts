import { TestBed } from '@angular/core/testing';
import { Photo } from '../../interfaces/photo.interface';

import { PhotoApiService } from './photo-api.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('PhotoApiService', () => {
  let service: PhotoApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhotoApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PhotoApiService);
    httpMock = TestBed.inject(HttpTestingController);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    httpMock.verify();
  });

  it('should fetch photo list from picsum and map it to data model', () => {
    let result: Photo[] | undefined;

    service.getPhotoList(1).subscribe((photos) => {
      result = photos;
    });

    const req = httpMock.expectOne('https://picsum.photos/v2/list?page=1&limit=12');
    expect(req.request.method).toBe('GET');
    req.flush([
      {
        id: '10',
        author: 'John Doe',
        width: 600,
        height: 400,
        url: 'https://picsum.photos/600/400',
        download_url: 'https://picsum.photos/600/400/download',
      },
    ]);

    expect(result).toBeUndefined();

    vi.advanceTimersByTime(300);

    expect(result).toEqual([
      {
        id: '10',
        author: 'John Doe',
        url: 'https://picsum.photos/600/400/download',
      },
    ]);
  });
});
