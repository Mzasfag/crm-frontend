import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'dashboard/**',
    renderMode: RenderMode.Server,
  },
  {
    path: 'tasks/**',
    renderMode: RenderMode.Server,
  },
  {
    path: 'customers/**',
    renderMode: RenderMode.Server,
  },
  // باقي الروتس لو حابب تسيبها Prerender أو تخلي الـ Wildcard الأساسي Server
  {
    path: '**',
    renderMode: RenderMode.Server, // الأفضل للسيستم الـ CRM تخلي الـ Default هو Server
  },
];
