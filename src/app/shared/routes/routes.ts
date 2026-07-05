import { Routes } from "@angular/router";

export const content: Routes = [
  {
    path: "dashboard",
    loadChildren: () => import("../../components/dashboard/dashboard.module").then((m) => m.DashboardModule),
  },
   {
     path : 'orders',
     loadChildren: () => import("../../components/order/order.module").then((m) => m.OrderModule)
   },
  {
    path: 'category',
    loadChildren: () => import("../../components/category/category.module").then((m) => m.CategoryModule)
  },
  {
    path: 'products',
    loadChildren: () => import("../../components/product/product.module").then((m) => m.ProductModule)
  },

  {
    path : 'tags',
    loadChildren: () => import("../../components/tags/tags.module").then((m) => m.TagsModule)
  },

   {
     path : 'ads',
     loadChildren: () => import("../../components/ads/ads.module").then((m) => m.AdsModule)
   },
  {
    path : 'customers',
    loadChildren: () => import("../../components/customer/customer.module").then((m) => m.CustomerModule)
  },
  {
    path : 'carriers',
    loadChildren: () => import("../../components/carrier/carrier.module").then((m) => m.CarrierModule)
  },
  {
    path : 'promotions',
    loadChildren: () => import("../../components/promotion/promotion.module").then((m) => m.PromotionModule)
  },
  {
    path : 'packs',
    loadChildren: () => import("../../components/packs/packs.module").then((m) => m.PacksModule)
  },
  {
    path : 'coupons',
    loadChildren: () => import("../../components/coupons/coupons.module").then((m) => m.CouponsModule)
  },
  {
    path : 'setting',
    loadChildren: () => import("../../components/settings/settings.module").then((m) => m.SettingsModule)
  },
  {
    path : 'user',
    loadChildren: () => import("../../components/user/user.module").then((m) => m.UserModule)
  },
  {
    path : 'roles',
    loadChildren: () => import("../../components/roles/roles.module").then((m) => m.RolesModule)
  },
  {
    path: '',
    loadChildren:() => import('./../../components/content/content.module').then((m) => m.ContentModule)
  }

];
