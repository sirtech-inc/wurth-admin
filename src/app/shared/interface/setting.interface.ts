import {FormArray, FormGroup} from "@angular/forms";
import {Attachment} from "@shared/interface/attachment.interface";
import {Mode} from "@shared/types/general.types";
import {CategoryFeatureStyleType, TypeStatus} from "@shared/types/util.types";

export interface Setting {
    id?: number;
    values: Values;
}

export interface Values {
    main: SettingMain
    maintenance: SettingMaintenance
    general: SettingGeneral
    home: SettingHome
    other: SettingOther
}

export interface ValuesResponse extends SettingMain, SettingMaintenance, SettingGeneral, SettingHome, SettingOther {
    code: number
    ecommerce: string
    social_networks: SocialNetworks[]
}

export interface SettingMain {
    general_site_title: string
    general_site_tagline: string
    general_copyright_text: string
    general_mode: Mode
}

export interface SocialNetworksPost {
    fk_configuration: number
    fk_social_network: number
    url: string
    status: TypeStatus
}

export interface SocialNetworks {
    code_social_network: number
    icon1: string
    icon2: string
    name: string
    url: string
    status: TypeStatus
}

export interface MainSettingForm {
    main: FormGroup
    maintenance: FormGroup
    social_networks: FormArray
    general: FormGroup
    home: FormGroup
    other: FormGroup
}

export interface SettingMaintenance {
    general_logo: number
    general_logo_images: Attachment
    general_logo_dark: number
    general_logo_dark_images: Attachment
    general_logo_tiny: number
    general_logo_tiny_images: Attachment
    general_favicon: number
    general_favicon_images: Attachment
    general_maintenance_title: string
    general_maintenance_mode: TypeStatus
    general_maintenance_image: number
    general_maintenance_image_images: Attachment
    general_maintenance_description: string
}

export interface SettingGeneral {
    service_back_to_top_enable: TypeStatus
    service_cart_enable: TypeStatus

    service_contact_mail_enable: TypeStatus
    service_contact_mail: string
    service_contact_mail_description: string

    service_whatsapp_enable: TypeStatus
    service_whatsapp_description: string
    service_whatsapp_phone: string
    service_whatsapp_link: string

    header_call_center_status: TypeStatus
    header_call_center_phone: string
    header_call_center_description: string

    header_notice_status: TypeStatus
    header_notice_content: string | string[]

    header_whatsapp_status: TypeStatus
    header_whatsapp_description: string
    header_whatsapp_link: string

    header_mail_status: TypeStatus
    header_mail_description: string
    header_mail_email: string

    footer_style: Mode

    footer_category_show: TypeStatus
    footer_category_title: string
    footer_category_ids: number[]

    footer_follow_us_show: TypeStatus
    footer_follow_us_title: string
    footer_follow_us_ids: number[]

    footer_link_show: TypeStatus
    footer_link_title: string
    footer_link_ids: number[],

    // footer_page_show: TypeStatus
    // footer_page_title: string
    // footer_page_ids: number[],
    footer_content_show: TypeStatus
    footer_content_title: string
    footer_content_ids: number[],


    footer_contact_us_show: TypeStatus
    footer_contact_us_title: string
    footer_contact_us_address_first: string
    footer_contact_us_address_second: string
    footer_contact_us_support_phone: string
    footer_contact_us_support_email: string

    footer_copy_right_show: TypeStatus
    footer_copy_right_logo_group: number
    footer_copy_right_logo_group_images: Attachment
    footer_copy_right_content: string

    footer_payment_show: TypeStatus
    footer_payment_title: string
    footer_payment_payment_image: number
    footer_payment_payment_images: Attachment

    footer_policies_show: TypeStatus
    footer_policies_ids: number[]

    product_layout: string

    product_payment_status: TypeStatus
    product_payment_checkout_secure_title: string
    product_payment_checkout_secure_image: number
    product_payment_checkout_secure_images: Attachment
    product_payment_checkout_method_payment_title: string
    product_payment_checkout_method_payment_image: number
    product_payment_checkout_method_payment_images: Attachment

    product_social_share_status: TypeStatus
    product_social_share_title: string
    product_social_share_ids: number[]

    product_is_trending: TypeStatus
    category_layout: string
    category_banner: number
}

export interface SettingHome {
    home_banner_status: TypeStatus
    home_teaser_status: TypeStatus

    home_sidebar_category_title: string
    home_sidebar_products_status: TypeStatus
    home_sidebar_products_title: string
    home_sidebar_products_ids: number[]

    home_feature_products_status: TypeStatus
    home_feature_products_title: string
    home_feature_products_description: string

    home_top_selling_status: TypeStatus
    home_top_selling_style: string
    home_top_selling_title: string
    home_top_selling_description: string

    home_new_product_status: TypeStatus
    home_new_product_style: string
    home_new_product_title: string
    home_new_product_description: string

    home_banner_coupons: TypeStatus
    home_banner_two_columns: TypeStatus
    home_banner_full_width: TypeStatus

    home_featured_categories_status: TypeStatus
    home_featured_categories_title: string
    home_featured_categories_description: string
    home_featured_categories_ids: number[]
    home_featured_categories_style: CategoryFeatureStyleType
}

export interface SettingOther {
    analytics_facebook_pixel_status: TypeStatus
    analytics_facebook_pixel_id: string
    analytics_google_status: TypeStatus
    analytics_google_id: string
    recaptcha_status: TypeStatus
    recaptcha_secret_key: string
    recaptcha_site_key: string
    mail_new_order_status: TypeStatus
    mail_new_order_mails: string
    mail_new_customer_status: TypeStatus
    mail_new_customer_mails: string
}

export interface SettingLinks {
    code: number
    label: string
    url: string
}

export interface SettingContents {
    code: number
    title: string
}

export interface SettingPolicies {
    code: number
    title: string
}