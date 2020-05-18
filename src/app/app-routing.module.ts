import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'new-course-modal',
    loadChildren: () => import('./page/new-course-modal/new-course-modal.module').then( m => m.NewCourseModalPageModule)
  },
  {
    path: 'new-meeting',
    loadChildren: () => import('./pages/new-meeting/new-meeting.module').then( m => m.NewMeetingPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
