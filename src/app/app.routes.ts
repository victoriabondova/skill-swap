import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'offers',
    loadComponent: () => import('./features/offers/catalog/catalog.component').then(m => m.CatalogComponent)
  },
  {
    path: 'offers/create',
    loadComponent: () => import('./features/offers/create/create.component').then(m => m.CreateComponent),
    canActivate: [authGuard]
  },
  {
    path: 'offers/:id/edit',
    loadComponent: () => import('./features/offers/edit/edit.component').then(m => m.EditComponent),
    canActivate: [authGuard]
  },
  {
    path: 'offers/:id',
    loadComponent: () => import('./features/offers/details/details.component').then(m => m.DetailsComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'swaps',
    loadComponent: () => import('./features/swaps/swaps.component').then(m => m.SwapsComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];