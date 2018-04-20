
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '/', component: () => import('pages/Repositories'), name: 'root' },
      { path: '/details', component: () => import('pages/Details'), name: 'details' },
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
