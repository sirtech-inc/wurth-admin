import { Menu } from "../interface/menu.interface";

export const menu: Menu[] = [
    {
      id: 1,
      title: "sidebar_menu_dashboard",
      path: "/dashboard",
      active: false,
      icon: "ri-dashboard-3-line",
      type: "sub",
      level: 1
    },
    {
      id: 11,
      title: "sidebar_menu_users",
      icon: "ri-user-3-line",
      type: "sub",
      level: 1,
      children: [
        {
          title: "sidebar_menu_all_users",
          path: "/user",
          level: 2,
          type: "link",
          parent_id: 11
        },
        {
          title: "sidebar_menu_add_users",
          path: "/user/create",
          level: 2,
          type: "link",
          parent_id: 11
        },
        {
          title: "sidebar_menu_roles",
          path: "/roles",
          level: 2,
          type: "link",
          parent_id: 11
        }
      ]
    },
    {
      id: 2,
      title: "sidebar_menu_orders",
      icon : "ri-shopping-cart-2-line",
      type : "sub",
      level : 1,
      children:[
        {
          title : "sidebar_menu_all_orders",
          path : "/orders",
          level : 2,
          type : "link",
          parent_id : 2
        },
      ]
    },
    {
      id : 3,
      title : "sidebar_menu_catalog",
      icon : "ri-folder-line",
      type : "sub",
      level : 1,
      children : [
        {
          title : "sidebar_menu_all_product",
          path : "/products",
          level : 2,
          type : "link",
          parent_id : 3
        },
        {
          title : "sidebar_menu_add_product",
          path : "/products/create",
          level : 2,
          type : "link",
          parent_id : 3
        },
        {
          title : "sidebar_menu_categories",
          path : "/category",
          level : 2,
          type : "link",
          parent_id : 3
        },
        {
          title : "sidebar_menu_tags",
          path : "/tags",
          level : 2,
          type : "link",
          parent_id : 3
        }
      ]
    },
    {
      id : 4,
      title : "sidebar_menu_visual_elements",
      icon : "ri-gallery-line",
      type : "sub",
      level : 1,
      children:[
        {
          title : "sidebar_menu_all_visual_elements",
          path : "/ads",
          level : 2,
          type : "link",
          parent_id : 4
        },{
          title : "sidebar_menu_add_visual_element",
          path : "/ads/create",
          level : 2,
          type : "link",
          parent_id : 4
        }
      ]
    },
    {
      id : 5,
      title : "sidebar_menu_customers",
      icon : "ri-building-2-fill",
      type : "sub",
      level : 1,
      children:[
        {
          title : "sidebar_menu_all_customers",
          path : "/customers",
          level : 2,
          type : "link",
          parent_id : 5
        },
        {
          title : "sidebar_menu_add_customer",
          path : "/customers/create",
          level : 2,
          type : "link",
          parent_id : 5
        }
      ]
    },
    {
      id : 6,
      title : "sidebar_menu_carriers",
      icon : "ri-truck-line",
      type : "sub",
      level : 1,
      children:[
        {
          title : "sidebar_menu_all_carriers",
          path : "/carriers",
          level : 2,
          type : "link",
          parent_id : 6
        },
        {
          title : "sidebar_menu_add_carrier",
          path : "/carriers/create",
          level : 2,
          type : "link",
          parent_id : 6
        }
      ]
    },
    {
      id : 7,
      title : "sidebar_menu_promotions",
      icon : "ri-percent-fill",
      type : "sub",
      level : 1,
      children:[
        {
          title : "sidebar_menu_all_promotions",
          path : "/promotions",
          level : 2,
          type : "link",
          parent_id : 7
        },
        {
          title : "sidebar_menu_add_promotion",
          path : "/promotions/create",
          level : 2,
          type : "link",
          parent_id : 7
        }
      ]
    },
    {
      id : 8,
      title : "sidebar_menu_packs",
      icon : "ri-box-3-fill",
      type : "sub",
      level : 1,
      children:[
        {
          title : "sidebar_menu_all_packs",
          path : "/packs",
          level : 2,
          type : "link",
          parent_id : 8
        }
      ]
    },
    {
      id : 9,
      title : "sidebar_menu_coupons",
      icon : "ri-coupon-5-fill",
      type : "sub",
      level : 1,
      children:[
        {
          title : "sidebar_menu_all_coupons",
          path : "/coupons",
          level : 2,
          type : "link",
          parent_id : 9
        },
        {
          title : "sidebar_menu_add_coupon",
          path : "/coupons/create",
          level : 2,
          type : "link",
          parent_id : 9
        }
      
      ]
    }, 
    {
      id: 11,
      title: "sidebar_menu_content",
      icon: "ri-article-line",
      type: "sub",
      level: 1,
      children:[
        {
          title: "sidebar_menu_menus",
          path: "/menus",
          level: 2,
          type: "link",
          parent_id: 11
        },
        // {
        //   title: "sidebar_menu_pages",
        //   path: "/pages",
        //   level: 2,
        //   type: "link",
        //   parent_id: 11
        // }
      ]
    },
    {
      id : 10,
      title : "sidebar_menu_setting",
      icon : "ri-settings-2-fill",
      type : "sub",
      path : "/setting",
      level : 1,
    },
];
