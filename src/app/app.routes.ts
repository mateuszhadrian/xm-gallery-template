import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/photos-page/photos-page').then((m) => m.PhotosPage),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./components/favorites-page/favorites-page').then((m) => m.FavoritesPage),
  },
  {
    path: 'photos/:id',
    loadComponent: () =>
      import('./components/photo-preview-page/photo-preview-page').then((m) => m.PhotoPreviewPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
