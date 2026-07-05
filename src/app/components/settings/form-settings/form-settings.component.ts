import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { CreateUpdateSettingOption } from "@shared/action";
import { UploadFileImage } from "@shared/action/file-image.action";
import { fadeAnimation } from "@shared/animations";
import {ProductState} from "@shared/state/product.state";
import { Mode } from "@shared/types/general.types";
import { CategoryFeatureStyleType, CustomeFormControl, OptionalAll, TypeStatus } from "@shared/types/util.types";
import {
    Attachment,
    CategoryModel,
    MainSettingForm, ProductToSelect,
    Select2DataFormat,
    SettingGeneral,
    SettingHome, SettingLinks, SettingMain,
    SettingMaintenance, SettingOther,
    SocialNetworks, Upload,
    ValuesResponse
} from "@shared/interface";
import { Select, Store } from "@ngxs/store";
import { ParameterState } from "@shared/state/parameter.state";
import { forkJoin, map, Observable, Subject, takeUntil } from "rxjs";
import { ParameterService } from "@shared/services/parameter.service";
import { SettingService } from "@shared/services/setting.service";
import { SettingState } from "@shared/state/setting.state";
import { Transform } from '@shared/helper/transform.helper';
import * as DATA from '@shared/data'

@Component({
    selector: 'app-form-settings',
    templateUrl: './form-settings.component.html',
    animations: [
        fadeAnimation
    ]
})
export class FormSettingsComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

    @Input('ecommerce') ecommerce: string;
    @Select(ParameterState.parametersSelect2('backoffice_mode')) backoffice_mode$: Observable<Select2DataFormat<string>[]>;
    @Select(SettingState.categories) categories$: Observable<CategoryModel>;
    @Select(SettingState.socialNetworksSelect2) socialNetworks$: Observable<Select2DataFormat<string>[]>
    @Select(SettingState.socialNetworks) socialNetworksData$: Observable<SocialNetworks[]>
    @Select(SettingState.settingResponse) setting$: Observable<ValuesResponse>
    @Select(SettingState.settingLinksSelect2) settingLinks$: Observable<Select2DataFormat<string>[]>
    @Select(SettingState.settingContentsSelect2) settingContents$  : Observable<Select2DataFormat<string>[]>
    @Select(SettingState.settingPoliciesSelect2) settingPolicies$: Observable<Select2DataFormat<string>[]>
    @Select(ProductState.productsSelect) products$: Observable<ProductToSelect[]>

    public code: number // Código del registro de configuration

    //Images for Upload
    private fileLogo: File
    private fileLogoDark: File
    private fileLogoTiny: File
    private fileFavicon: File
    private fileMaintenanceImage: File
    private fileLogoWurthGroupFooterImage: File
    private filePaymentMethodFooterImage: File
    private fileCheckoutSecureProductImage: File
    private fileCheckoutMethodPaymentProductImage: File

    public selectedProductsSidebar: ProductToSelect[] = [];

    private fileSelected: {
        light: Attachment,
        dark: Attachment,
        tiny: Attachment,
        favicon: Attachment,
        maintenance: Attachment,
        logoWurthGroupFooter: Attachment,
        paymentMethodFooter: Attachment,
        checkoutSecureProduct: Attachment,
        checkoutMethodPaymentProduct: Attachment
    }

    selectedCategories: number[] = []
    selectedCategoriesHomeFeatured: number[] = []


    public tabActive = 'main'
    public form: FormGroup
    private destroy$ = new Subject<void>();

    protected readonly Boolean = Boolean;
    protected readonly DATA = DATA


    constructor(
        private formBuilder: FormBuilder,
        private store: Store,
        private parameterService: ParameterService,
        private settingService: SettingService
    ) {
        this.setting$.pipe(takeUntil(this.destroy$)).subscribe({
            next: (data) => {
                this.code = data?.code
                this.loadData(data)
            }
        })


    }
    ngOnChanges(changes: SimpleChanges): void {

    }

    ngOnInit(): void {
        this.initForm();
        this.categories$.pipe(takeUntil(this.destroy$)).subscribe({
            next: (data) => {
                const currentSetting = this.store.selectSnapshot(SettingState.settingResponse);
                this.selectedCategories = currentSetting?.footer_category_ids ?? null
                this.selectedCategoriesHomeFeatured = currentSetting?.home_featured_categories_ids ?? null
                this.setFieldByGroup('general', 'footer_category_ids', currentSetting?.footer_category_ids ?? null)
                this.setFieldByGroup('home', 'home_featured_categories_ids', currentSetting?.home_featured_categories_ids ?? null)
            }
        })
        this.socialNetworksData$.pipe(takeUntil(this.destroy$)).subscribe({
            next: (data) => {
                this.addSocialNetwork(data)
            }
        })
    }

    ngAfterViewInit(): void { }


    private loadData(data: ValuesResponse) {
        if (data) {

            if(data?.home_sidebar_products_ids && data?.home_sidebar_products_ids.length > 0){
                const products = this.store.selectSnapshot(ProductState.productsSelect)
                this.selectedProductsSidebar = products.filter((item) => data?.home_sidebar_products_ids.includes(item.code))
            }

            this.setFieldByGroup('main', 'general_site_title', data.general_site_title)
            this.setFieldByGroup('main', 'general_site_tagline', data.general_site_tagline)
            this.setFieldByGroup('main', 'general_copyright_text', data.general_copyright_text)
            this.setFieldByGroup('main', 'general_mode', data.general_mode)

            this.setFieldByGroup('maintenance', 'general_logo', data.general_logo)
            this.setFieldByGroup('maintenance', 'general_logo_dark', data.general_logo_dark)
            this.setFieldByGroup('maintenance', 'general_logo_tiny', data.general_logo_tiny)
            this.setFieldByGroup('maintenance', 'general_favicon', data.general_favicon)
            this.setFieldByGroup('maintenance', 'general_maintenance_title', data.general_maintenance_title)
            this.setFieldByGroup('maintenance', 'general_maintenance_mode', Transform.CheckIsActive(data.general_maintenance_mode))
            this.setFieldByGroup('maintenance', 'general_maintenance_description', data.general_maintenance_description)
            this.setFieldByGroup('maintenance', 'general_maintenance_image', data.general_maintenance_image)

            this.setFieldByGroup('general', 'service_back_to_top_enable', Transform.CheckIsActive(data.service_back_to_top_enable))
            this.setFieldByGroup('general', 'service_cart_enable', Transform.CheckIsActive(data.service_cart_enable))
            this.setFieldByGroup('general', 'service_contact_mail_enable', Transform.CheckIsActive(data.service_contact_mail_enable))
            this.setFieldByGroup('general', 'service_contact_mail', data.service_contact_mail)
            this.setFieldByGroup('general', 'service_contact_mail_description', data.service_contact_mail_description)
            this.setFieldByGroup('general', 'service_whatsapp_enable', Transform.CheckIsActive(data.service_whatsapp_enable))
            this.setFieldByGroup('general', 'service_whatsapp_description', data.service_whatsapp_description)
            this.setFieldByGroup('general', 'service_whatsapp_phone', data.service_whatsapp_phone)
            this.setFieldByGroup('general', 'service_whatsapp_link', data.service_whatsapp_link)
            this.setFieldByGroup('general', 'header_call_center_status', Transform.CheckIsActive(data.header_call_center_status))
            this.setFieldByGroup('general', 'header_call_center_phone', data.header_call_center_phone)
            this.setFieldByGroup('general', 'header_call_center_description', data.header_call_center_description)
            this.setFieldByGroup('general', 'header_notice_status', Transform.CheckIsActive(data.header_notice_status))
            this.setFieldByGroup('general', 'header_notice_content', data.header_notice_content)
            this.setFieldByGroup('general', 'header_whatsapp_status', Transform.CheckIsActive(data.header_whatsapp_status))
            this.setFieldByGroup('general', 'header_whatsapp_description', data.header_whatsapp_description)
            this.setFieldByGroup('general', 'header_whatsapp_link', data.header_whatsapp_link)
            this.setFieldByGroup('general', 'header_mail_status', Transform.CheckIsActive(data.header_mail_status))
            this.setFieldByGroup('general', 'header_mail_description', data.header_mail_description)
            this.setFieldByGroup('general', 'header_mail_email', data.header_mail_email)
            this.setFieldByGroup('general', 'footer_style', data.footer_style)
            this.setFieldByGroup('general', 'footer_category_show', Transform.CheckIsActive(data.footer_category_show))
            this.setFieldByGroup('general', 'footer_category_title', data.footer_category_title)
            this.setFieldByGroup('general', 'footer_category_ids', data.footer_category_ids)
            this.setFieldByGroup('general', 'footer_follow_us_show', Transform.CheckIsActive(data.footer_follow_us_show))
            this.setFieldByGroup('general', 'footer_follow_us_title', data.footer_follow_us_title)
            this.setFieldByGroup('general', 'footer_follow_us_ids', data.footer_follow_us_ids)
            this.setFieldByGroup('general', 'footer_link_show', Transform.CheckIsActive(data.footer_link_show))
            this.setFieldByGroup('general', 'footer_link_title', data.footer_link_title)
            this.setFieldByGroup('general', 'footer_link_ids', data.footer_link_ids)

            this.setFieldByGroup('general', 'footer_content_show', Transform.CheckIsActive(data.footer_content_show))
            this.setFieldByGroup('general', 'footer_content_title', data.footer_content_title)
            this.setFieldByGroup('general', 'footer_content_ids', data.footer_content_ids)

            this.setFieldByGroup('general', 'footer_contact_us_show', Transform.CheckIsActive(data.footer_contact_us_show))
            this.setFieldByGroup('general', 'footer_contact_us_title', data.footer_contact_us_title)
            this.setFieldByGroup('general', 'footer_contact_us_address_first', data.footer_contact_us_address_first)
            this.setFieldByGroup('general', 'footer_contact_us_address_second', data.footer_contact_us_address_second)
            this.setFieldByGroup('general', 'footer_contact_us_support_phone', data.footer_contact_us_support_phone)
            this.setFieldByGroup('general', 'footer_contact_us_support_email', data.footer_contact_us_support_email)
            this.setFieldByGroup('general', 'footer_copy_right_show', Transform.CheckIsActive(data.footer_copy_right_show))
            this.setFieldByGroup('general', 'footer_copy_right_logo_group', data.footer_copy_right_logo_group)
            this.setFieldByGroup('general', 'footer_copy_right_content', data.footer_copy_right_content)
            this.setFieldByGroup('general', 'footer_payment_show', Transform.CheckIsActive(data.footer_payment_show))
            this.setFieldByGroup('general', 'footer_payment_title', data.footer_payment_title)
            this.setFieldByGroup('general', 'footer_payment_payment_image', data.footer_payment_payment_image)
            this.setFieldByGroup('general', 'footer_policies_show', Transform.CheckIsActive(data.footer_policies_show))
            this.setFieldByGroup('general', 'footer_policies_ids', data.footer_policies_ids)
            this.setFieldByGroup('general', 'product_layout', data.product_layout)
            this.setFieldByGroup('general', 'product_payment_status', Transform.CheckIsActive(data.product_payment_status))
            this.setFieldByGroup('general', 'product_payment_checkout_secure_title', data.product_payment_checkout_secure_title)
            this.setFieldByGroup('general', 'product_payment_checkout_secure_image', data.product_payment_checkout_secure_image)
            this.setFieldByGroup('general', 'product_payment_checkout_method_payment_title', data.product_payment_checkout_method_payment_title)
            this.setFieldByGroup('general', 'product_payment_checkout_method_payment_image', data.product_payment_checkout_method_payment_image)
            this.setFieldByGroup('general', 'product_social_share_status', Transform.CheckIsActive(data.product_social_share_status))
            this.setFieldByGroup('general', 'product_social_share_title', data.product_social_share_title)
            this.setFieldByGroup('general', 'product_social_share_ids', data.product_social_share_ids)
            this.setFieldByGroup('general', 'product_is_trending', Transform.CheckIsActive(data.product_is_trending))
            this.setFieldByGroup('general', 'category_layout', data.category_layout)
            this.setFieldByGroup('general', 'category_banner', data.category_banner)

            this.setFieldByGroup('home', 'home_banner_status', Transform.CheckIsActive(data.home_banner_status))
            this.setFieldByGroup('home', 'home_teaser_status', Transform.CheckIsActive(data.home_teaser_status))
            this.setFieldByGroup('home', 'home_sidebar_category_title', data.home_sidebar_category_title)
            this.setFieldByGroup('home', 'home_sidebar_products_status', Transform.CheckIsActive(data.home_sidebar_products_status))
            this.setFieldByGroup('home', 'home_sidebar_products_title', data.home_sidebar_products_title)
            this.setFieldByGroup('home', 'home_feature_products_status', Transform.CheckIsActive(data.home_feature_products_status))
            this.setFieldByGroup('home', 'home_feature_products_title', data.home_feature_products_title)
            this.setFieldByGroup('home', 'home_feature_products_description', data.home_feature_products_description)
            this.setFieldByGroup('home', 'home_top_selling_status', Transform.CheckIsActive(data.home_top_selling_status))
            this.setFieldByGroup('home', 'home_top_selling_style', data.home_top_selling_style)
            this.setFieldByGroup('home', 'home_top_selling_title', data.home_top_selling_title)
            this.setFieldByGroup('home', 'home_top_selling_description', data.home_top_selling_description)
            this.setFieldByGroup('home', 'home_new_product_status', Transform.CheckIsActive(data.home_new_product_status))
            this.setFieldByGroup('home', 'home_new_product_style', data.home_new_product_style)
            this.setFieldByGroup('home', 'home_new_product_title', data.home_new_product_title)
            this.setFieldByGroup('home', 'home_new_product_description', data.home_new_product_description)
            this.setFieldByGroup('home', 'home_banner_coupons', Transform.CheckIsActive(data.home_banner_coupons))
            this.setFieldByGroup('home', 'home_banner_two_columns', Transform.CheckIsActive(data.home_banner_two_columns))
            this.setFieldByGroup('home', 'home_banner_full_width', Transform.CheckIsActive(data.home_banner_full_width))

            this.setFieldByGroup('home', 'home_featured_categories_status', Transform.CheckIsActive(data.home_featured_categories_status))
            this.setFieldByGroup('home', 'home_featured_categories_title', data.home_featured_categories_title)
            this.setFieldByGroup('home', 'home_featured_categories_description', data.home_featured_categories_description)
            this.setFieldByGroup('home', 'home_featured_categories_style', data.home_featured_categories_style || null)

            this.setFieldByGroup('other', 'analytics_facebook_pixel_status', Transform.CheckIsActive(data.analytics_facebook_pixel_status))
            this.setFieldByGroup('other', 'analytics_facebook_pixel_id', data.analytics_facebook_pixel_id)
            this.setFieldByGroup('other', 'analytics_google_status', Transform.CheckIsActive(data.analytics_google_status))
            this.setFieldByGroup('other', 'analytics_google_id', data.analytics_google_id)
            this.setFieldByGroup('other', 'recaptcha_status', Transform.CheckIsActive(data.recaptcha_status))
            this.setFieldByGroup('other', 'recaptcha_secret_key', data.recaptcha_secret_key)
            this.setFieldByGroup('other', 'recaptcha_site_key', data.recaptcha_site_key)
            this.setFieldByGroup('other', 'mail_new_order_status', Transform.CheckIsActive(data.mail_new_order_status))
            this.setFieldByGroup('other', 'mail_new_order_mails', data.mail_new_order_mails)
            this.setFieldByGroup('other', 'mail_new_customer_status', Transform.CheckIsActive(data.mail_new_customer_status))
            this.setFieldByGroup('other', 'mail_new_customer_mails', data.mail_new_customer_mails)

            this.fileSelected = {
                light: data.general_logo_images,
                dark: data.general_logo_dark_images,
                tiny: data.general_logo_tiny_images,
                favicon: data.general_favicon_images,
                maintenance: data.general_maintenance_image_images,
                logoWurthGroupFooter: data.footer_copy_right_logo_group_images,
                paymentMethodFooter: data.footer_payment_payment_images,
                checkoutSecureProduct: data.product_payment_checkout_secure_images,
                checkoutMethodPaymentProduct: data.product_payment_checkout_method_payment_images
            }

            this.selectedCategories = data?.footer_category_ids ?? []
            this.selectedCategoriesHomeFeatured = data?.home_featured_categories_ids ?? []

        }
    }


    private initForm() {
        this.form = this.formBuilder.group<MainSettingForm>({
            main : this.formBuilder.group<CustomeFormControl<OptionalAll<SettingMain>>>({
                general_site_title: new FormControl(null),
                general_site_tagline: new FormControl(null),
                general_copyright_text: new FormControl(null),
                general_mode: new FormControl(null), // NO USADO
            }),
            maintenance: this.formBuilder.group<CustomeFormControl<OptionalAll<SettingMaintenance>>>({
                general_logo: new FormControl(null),
                general_logo_dark: new FormControl(null),
                general_logo_tiny: new FormControl(null),
                general_favicon: new FormControl(null),
                general_maintenance_title: new FormControl(null),
                general_maintenance_mode: new FormControl(null),
                general_maintenance_description: new FormControl(null),
                general_maintenance_image: new FormControl(null)
            }),
            social_networks: this.formBuilder.array([] as SocialNetworks[]),
            general: this.formBuilder.group<CustomeFormControl<OptionalAll<SettingGeneral>>>({
                service_back_to_top_enable: new FormControl(null),
                service_cart_enable: new FormControl(null),
                service_contact_mail_enable: new FormControl(null),
                service_contact_mail: new FormControl(null),
                service_contact_mail_description: new FormControl(null),

                service_whatsapp_enable: new FormControl(null),
                service_whatsapp_description: new FormControl(null),
                service_whatsapp_phone: new FormControl(null),
                service_whatsapp_link: new FormControl(null),

                header_call_center_status: new FormControl(null),
                header_call_center_phone: new FormControl(null),
                header_call_center_description: new FormControl(null),

                header_notice_status: new FormControl(null),
                header_notice_content: new FormControl(null),
                header_whatsapp_status: new FormControl(null),
                header_whatsapp_description: new FormControl(null),
                header_whatsapp_link: new FormControl(null),
                header_mail_status: new FormControl(null),
                header_mail_description: new FormControl(null),
                header_mail_email: new FormControl(null),

                footer_style: new FormControl(null), // NO USADO

                footer_category_show: new FormControl(null),
                footer_category_title: new FormControl(null),
                footer_category_ids: new FormControl(null),

                footer_follow_us_show: new FormControl(null),
                footer_follow_us_title: new FormControl(null),
                footer_follow_us_ids: new FormControl(null),
                footer_link_show: new FormControl(null),
                footer_link_title: new FormControl(null),
                footer_link_ids: new FormControl(null),

                footer_content_show: new FormControl(null),
                footer_content_title: new FormControl(null),
                footer_content_ids: new FormControl(null),

                footer_contact_us_show: new FormControl(null),
                footer_contact_us_title: new FormControl(null),
                footer_contact_us_address_first: new FormControl(null),
                footer_contact_us_address_second: new FormControl(null),
                footer_contact_us_support_phone: new FormControl(null),
                footer_contact_us_support_email: new FormControl(null),
                footer_copy_right_show: new FormControl(null),
                footer_copy_right_logo_group: new FormControl(null),
                footer_copy_right_content: new FormControl(null),
                footer_payment_show: new FormControl(null),
                footer_payment_title: new FormControl(null),
                footer_payment_payment_image: new FormControl(null),
                footer_policies_show: new FormControl(null),
                footer_policies_ids: new FormControl(null),
                product_layout: new FormControl(null),
                product_payment_status: new FormControl(null),
                product_payment_checkout_secure_title: new FormControl(null),
                product_payment_checkout_secure_image: new FormControl(null),
                product_payment_checkout_method_payment_title: new FormControl(null),
                product_payment_checkout_method_payment_image: new FormControl(null),
                product_social_share_status: new FormControl(null),
                product_social_share_title: new FormControl(null),
                product_social_share_ids: new FormControl(null),
                product_is_trending: new FormControl(null), // FALTA INTEGRAR
                category_layout: new FormControl(null), // FALTA INTEGRAR
                category_banner: new FormControl(null) // FALTA INTEGRAR
            }),
            home: this.formBuilder.group<CustomeFormControl<OptionalAll<SettingHome>>>({
                home_banner_status: new FormControl(null),
                home_teaser_status: new FormControl(null),
                home_sidebar_category_title: new FormControl(null),
                home_sidebar_products_status: new FormControl(null),
                home_sidebar_products_ids: new FormControl(null),
                home_sidebar_products_title: new FormControl(null),

                home_feature_products_status: new FormControl(null),
                home_feature_products_title: new FormControl(null),
                home_feature_products_description: new FormControl(null),
                home_top_selling_status: new FormControl(null),
                home_top_selling_style: new FormControl(null),
                home_top_selling_title: new FormControl(null),
                home_top_selling_description: new FormControl(null),
                home_new_product_status: new FormControl(null),
                home_new_product_style: new FormControl(null),
                home_new_product_title: new FormControl(null),
                home_new_product_description: new FormControl(null),
                home_banner_coupons: new FormControl(null),
                home_banner_two_columns: new FormControl(null),
                home_banner_full_width: new FormControl(null),
                home_featured_categories_status: new FormControl(null),
                home_featured_categories_title: new FormControl(null),
                home_featured_categories_description: new FormControl(null),
                home_featured_categories_ids: new FormControl(null),
                home_featured_categories_style: new FormControl(null) // FALTA INTEGRAR - NO SE USARÁ
            }),
            other: this.formBuilder.group<CustomeFormControl<OptionalAll<SettingOther>>>({
                analytics_facebook_pixel_status: new FormControl(null),
                analytics_facebook_pixel_id: new FormControl(null),
                analytics_google_status: new FormControl(null),
                analytics_google_id: new FormControl(null),
                recaptcha_status: new FormControl(null),
                recaptcha_secret_key: new FormControl(null),
                recaptcha_site_key: new FormControl(null),
                mail_new_order_status: new FormControl(null),
                mail_new_order_mails: new FormControl(null),
                mail_new_customer_status: new FormControl(null),
                mail_new_customer_mails: new FormControl(null)
            })
        })
    }

    private getFieldByGroup(group: string, field: string) {
        return this.form.get(group).get(field).value
    }

    private setFieldByGroup(group: string, field: string, value: any): void {
        this.form.get(group).get(field).setValue(value)
    }

    getField<T>(group: string, field: string): T {
        return this.getFieldByGroup(group, field) as T
    }

    getFieldSimple<T>(field:string):T{
        return this.form.get(field).value as T
    }

    getFieldBool(group: string, field: string) {
        return this.getFieldByGroup(group, field) as boolean
    }

    getActiveInactive(group: string, field: string) {
        return Transform.CheckIsActive(this.getFieldByGroup(group, field)) ? 'active' : 'inactive' as TypeStatus
    }

    get socialNetworks(): FormArray {
        return this.form.get('social_networks') as FormArray
    }

    private addSocialNetwork(data: SocialNetworks[]) {
        this.socialNetworks.clear()
        data.forEach((social) => {
            (this.form.get('social_networks') as FormArray).push(this.prepareFormGroupSocialNetwork(social))
        })

    }

    private prepareFormGroupSocialNetwork(data: SocialNetworks): FormGroup {
        return this.formBuilder.group<CustomeFormControl<OptionalAll<SocialNetworks>>>({
            code_social_network: new FormControl(data.code_social_network),
            name: new FormControl(data.name),
            icon1: new FormControl(data.icon1),
            icon2: new FormControl(data.icon2),
            url: new FormControl(data.url),
            status: new FormControl(Transform.CheckIsActive(data.status)),
        })

    }

    public onSelectFiles(event: File | File[], mode: 'light' | 'dark' | 'tiny' | 'favicon' | 'maintenance' | 'logoWurthGroupFooter' | 'paymentMethodFooter' | 'checkoutSecureProduct' | 'checkoutMethodPaymentProduct') {

        switch (mode) {
            case 'light':
                this.fileLogo = event as File
                break
            case 'dark':
                this.fileLogoDark = event as File
                break
            case 'tiny':
                this.fileLogoTiny = event as File
                break
            case 'favicon':
                this.fileFavicon = event as File
                break
            case 'maintenance':
                this.fileMaintenanceImage = event as File
                break
            case 'logoWurthGroupFooter':
                this.fileLogoWurthGroupFooterImage = event as File
                break
            case 'paymentMethodFooter':
                this.filePaymentMethodFooterImage = event as File
                break
            case 'checkoutSecureProduct':
                this.fileCheckoutSecureProductImage = event as File
                break
            case 'checkoutMethodPaymentProduct':
                this.fileCheckoutMethodPaymentProductImage = event as File
                break
        }

    }

    prepareImage(mode: 'light' | 'dark' | 'tiny' | 'favicon' | 'maintenance' | 'logoWurthGroupFooter' | 'paymentMethodFooter' | 'checkoutSecureProduct' | 'checkoutMethodPaymentProduct'): Attachment {
        if (mode === 'light' && this.fileSelected?.light) return { ...this.fileSelected.light }
        if (mode === 'dark' && this.fileSelected?.dark) return { ...this.fileSelected.dark }
        if (mode === 'tiny' && this.fileSelected?.tiny) return { ...this.fileSelected.tiny }
        if (mode === 'favicon' && this.fileSelected?.favicon) return { ...this.fileSelected.favicon }
        if (mode === 'maintenance' && this.fileSelected?.maintenance) return { ...this.fileSelected.maintenance }
        if (mode === 'logoWurthGroupFooter' && this.fileSelected?.logoWurthGroupFooter) return { ...this.fileSelected.logoWurthGroupFooter }
        if (mode === 'paymentMethodFooter' && this.fileSelected?.paymentMethodFooter) return { ...this.fileSelected.paymentMethodFooter }
        if (mode === 'checkoutSecureProduct' && this.fileSelected?.checkoutSecureProduct) return { ...this.fileSelected.checkoutSecureProduct }
        if (mode === 'checkoutMethodPaymentProduct' && this.fileSelected?.checkoutMethodPaymentProduct) return { ...this.fileSelected.checkoutMethodPaymentProduct }
        return null

    }

    onSelectCategoryItem(data: number[]) {
        if (Array.isArray(data) && data.length > 0) {
            this.setFieldByGroup('general', 'footer_category_ids', data)
        } else {
            this.setFieldByGroup('general', 'footer_category_ids', null)
        }
    }

    onSelectCategoryItemHomeFeatured(data: number[]) {
        if (Array.isArray(data) && data.length > 0) {
            this.setFieldByGroup('home', 'home_featured_categories_ids', data)
        } else {
            this.setFieldByGroup('home', 'home_featured_categories_ids', null)
        }
    }

    onSave() {
        const fileLogo$ = this.store.dispatch(new UploadFileImage(this.fileLogo, 'queryString', {
            vDescripcion: 'Logo',
            vModule: 'configuration',
        }, false)).pipe(
            map((response) => {
                return response.file.selectedFile as Upload
            })
        )
        const fileLogoDark$ = this.store.dispatch(new UploadFileImage(this.fileLogoDark, 'queryString', {
            vDescripcion: 'Logo Dark',
            vModule: 'configuration',
        }, false)).pipe(
            map((response) => {
                return response.file.selectedFile as Upload
            })
        )
        const fileLogoTiny$ = this.store.dispatch(new UploadFileImage(this.fileLogoTiny, 'queryString', {
            vDescripcion: 'Logo Tiny',
            vModule: 'configuration',
        }, false)).pipe(
            map((response) => {
                return response.file.selectedFile as Upload
            })
        )
        const fileFavicon$ = this.store.dispatch(new UploadFileImage(this.fileFavicon, 'queryString', {
            vDescripcion: 'Favicon',
            vModule: 'configuration',
        }, false)).pipe(
            map((response) => {
                return response.file.selectedFile as Upload
            })
        )
        const fileMaintenanceImage$ = this.store.dispatch(new UploadFileImage(this.fileMaintenanceImage, 'queryString', {
            vDescripcion: 'Maintenance Image',
            vModule: 'configuration',
        }, false)).pipe(
            map((response) => {
                return response.file.selectedFile as Upload
            })
        )
        const fileLogoWurthGroupFooterImage$ = this.store.dispatch(new UploadFileImage(this.fileLogoWurthGroupFooterImage, 'queryString', {
            vDescripcion: 'Logo Wurth Group Footer',
            vModule: 'configuration',
        }, false)).pipe(
            map((response) => {
                return response.file.selectedFile as Upload
            })
        )
        const filePaymentMethodFooterImage$ = this.store.dispatch(new UploadFileImage(this.filePaymentMethodFooterImage, 'queryString', {
            vDescripcion: 'Payment Method Footer',
            vModule: 'configuration',
        }, false)).pipe(
            map((response) => {
                return response.file.selectedFile as Upload
            })
        )
        const fileCheckoutSecureProductImage$ = this.store.dispatch(new UploadFileImage(this.fileCheckoutSecureProductImage, 'queryString', {
            vDescripcion: 'Checkout Secure Product',
            vModule: 'configuration',
        }, false)).pipe(
            map((response) => {
                return response.file.selectedFile as Upload
            })
        )
        const fileCheckoutMethodPaymentProductImage$ = this.store.dispatch(new UploadFileImage(this.fileCheckoutMethodPaymentProductImage, 'queryString', {
            vDescripcion: 'Checkout Method Payment Product',
            vModule: 'configuration',
        }, false)).pipe(
            map((response) => {
                return response.file.selectedFile as Upload
            })
        )
        forkJoin([
            fileLogo$,
            fileLogoDark$,
            fileLogoTiny$,
            fileFavicon$,
            fileMaintenanceImage$,
            fileLogoWurthGroupFooterImage$,
            filePaymentMethodFooterImage$,
            fileCheckoutSecureProductImage$,
            fileCheckoutMethodPaymentProductImage$
        ]).subscribe({
            next: (files) => {

                const productsInSidebar = this.selectedProductsSidebar.map((product) => product.code)

                const prepareForm: OptionalAll<ValuesResponse> = {
                    code: this.code,
                    ecommerce: this.ecommerce,
                    general_site_title: this.getField<string>('main', 'general_site_title'),
                    general_site_tagline: this.getField<string>('main', 'general_site_tagline'),
                    general_copyright_text: this.getField<string>('main', 'general_copyright_text'),
                    general_mode: this.getField<Mode>('main', 'general_mode') || null,

                    general_logo: (files && files[0]?.code) || this.getField<number>('maintenance', 'general_logo') || null,
                    general_logo_dark: (files && files[1]?.code) || this.getField<number>('maintenance', 'general_logo_dark') || null,
                    general_logo_tiny: (files && files[2]?.code) || this.getField<number>('maintenance', 'general_logo_tiny') || null,
                    general_favicon: (files && files[3]?.code) || this.getField<number>('maintenance', 'general_favicon') || null,
                    general_maintenance_title: this.getField<string>('maintenance', 'general_maintenance_title'),
                    general_maintenance_mode: this.getActiveInactive('maintenance', 'general_maintenance_mode'),
                    general_maintenance_image: (files && files[4]?.code) || this.getField<number>('maintenance', 'general_maintenance_image') || null,
                    general_maintenance_description: this.getField<string>('maintenance', 'general_maintenance_description'),

                    service_back_to_top_enable: this.getActiveInactive('general', 'service_back_to_top_enable'),
                    service_cart_enable: this.getActiveInactive('general', 'service_cart_enable'),
                    service_contact_mail_enable: this.getActiveInactive('general', 'service_contact_mail_enable'),
                    service_contact_mail: this.getField<string>('general', 'service_contact_mail'),
                    service_contact_mail_description: this.getField<string>('general', 'service_contact_mail_description'),

                    service_whatsapp_enable: this.getActiveInactive('general', 'service_whatsapp_enable'),
                    service_whatsapp_description: this.getField<string>('general', 'service_whatsapp_description'),
                    service_whatsapp_phone: this.getField<string>('general', 'service_whatsapp_phone'),
                    service_whatsapp_link: this.getField<string>('general', 'service_whatsapp_link'),
                    header_call_center_status: this.getActiveInactive('general', 'header_call_center_status'),
                    header_call_center_phone: this.getField<string>('general', 'header_call_center_phone'),
                    header_call_center_description: this.getField<string>('general', 'header_call_center_description'),
                    header_notice_status: this.getActiveInactive('general', 'header_notice_status'),
                    header_notice_content: this.getField<string>('general', 'header_notice_content'),
                    header_whatsapp_status: this.getActiveInactive('general', 'header_whatsapp_status'),
                    header_whatsapp_description: this.getField<string>('general', 'header_whatsapp_description'),
                    header_whatsapp_link: this.getField<string>('general', 'header_whatsapp_link'),
                    header_mail_status: this.getActiveInactive('general', 'header_mail_status'),
                    header_mail_description: this.getField<string>('general', 'header_mail_description'),
                    header_mail_email: this.getField<string>('general', 'header_mail_email'),
                    footer_style: this.getField<Mode>('general', 'footer_style') || null,
                    footer_category_show: this.getActiveInactive('general', 'footer_category_show'),
                    footer_category_title: this.getField<string>('general', 'footer_category_title'),
                    footer_category_ids: this.getField<number[]>('general', 'footer_category_ids') || null,
                    footer_follow_us_show: this.getActiveInactive('general', 'footer_follow_us_show'),
                    footer_follow_us_title: this.getField<string>('general', 'footer_follow_us_title'),
                    footer_follow_us_ids: this.getField<number[]>('general', 'footer_follow_us_ids') || null,
                    footer_link_show: this.getActiveInactive('general', 'footer_link_show'),
                    footer_link_title: this.getField<string>('general', 'footer_link_title'),
                    footer_link_ids: this.getField<number[]>('general', 'footer_link_ids') || null,
                    footer_content_show: this.getActiveInactive('general', 'footer_content_show'),
                    footer_content_title: this.getField<string>('general', 'footer_content_title'),
                    footer_content_ids: this.getField<number[]>('general', 'footer_content_ids') || null,

                    footer_contact_us_show: this.getActiveInactive('general', 'footer_contact_us_show'),
                    footer_contact_us_title: this.getField<string>('general', 'footer_contact_us_title'),
                    footer_contact_us_address_first: this.getField<string>('general', 'footer_contact_us_address_first'),
                    footer_contact_us_address_second: this.getField<string>('general', 'footer_contact_us_address_second'),
                    footer_contact_us_support_phone: this.getField<string>('general', 'footer_contact_us_support_phone'),
                    footer_contact_us_support_email: this.getField<string>('general', 'footer_contact_us_support_email'),
                    footer_copy_right_show: this.getActiveInactive('general', 'footer_copy_right_show'),
                    footer_copy_right_logo_group: (files && files[5]?.code) || this.getField<number>('general', 'footer_copy_right_logo_group') || null,
                    footer_copy_right_content: this.getField<string>('general', 'footer_copy_right_content'),
                    footer_payment_show: this.getActiveInactive('general', 'footer_payment_show'),
                    footer_payment_title: this.getField<string>('general', 'footer_payment_title'),
                    footer_payment_payment_image: (files && files[6]?.code) || this.getField<number>('general', 'footer_payment_payment_image') || null,
                    footer_policies_show: this.getActiveInactive('general', 'footer_policies_show'),
                    footer_policies_ids: this.getField<number[]>('general', 'footer_policies_ids') || null,
                    product_layout: this.getField<string>('general', 'product_layout'),
                    product_payment_status: this.getActiveInactive('general', 'product_payment_status'),
                    product_payment_checkout_secure_title: this.getField<string>('general', 'product_payment_checkout_secure_title'),
                    product_payment_checkout_secure_image: (files && files[7]?.code) || this.getField<number>('general', 'product_payment_checkout_secure_image') || null,
                    product_payment_checkout_method_payment_title: this.getField<string>('general', 'product_payment_checkout_method_payment_title'),
                    product_payment_checkout_method_payment_image: (files && files[8]?.code) || this.getField<number>('general', 'product_payment_checkout_method_payment_image') || null,
                    product_social_share_status: this.getActiveInactive('general', 'product_social_share_status'),
                    product_social_share_title: this.getField<string>('general', 'product_social_share_title'),
                    product_social_share_ids: Transform.ArrayHasValue(this.getField<number[]>('general', 'product_social_share_ids')) ? this.getField<number[]>('general', 'product_social_share_ids') : null,
                    product_is_trending: this.getActiveInactive('general', 'product_is_trending'),
                    category_layout: this.getField<string>('general', 'category_layout'),
                    category_banner: this.getField<number>('general', 'category_banner') || null,

                    home_banner_status: this.getActiveInactive('home', 'home_banner_status'),
                    home_teaser_status: this.getActiveInactive('home', 'home_teaser_status'),
                    home_sidebar_category_title: this.getField<string>('home', 'home_sidebar_category_title'),
                    home_sidebar_products_status: this.getActiveInactive('home', 'home_sidebar_products_status'),
                    home_sidebar_products_title: this.getField<string>('home', 'home_sidebar_products_title'),
                    //home_sidebar_products_ids: this.getField<number[]>('home', 'home_sidebar_products_ids') || null,
                    home_sidebar_products_ids:  productsInSidebar && productsInSidebar.length > 0  ? productsInSidebar : null,

                    home_feature_products_status: this.getActiveInactive('home', 'home_feature_products_status'),
                    home_feature_products_title: this.getField<string>('home', 'home_feature_products_title'),
                    home_feature_products_description: this.getField<string>('home', 'home_feature_products_description'),
                    home_top_selling_status: this.getActiveInactive('home', 'home_top_selling_status'),
                    home_top_selling_style: this.getField<string>('home', 'home_top_selling_style'),
                    home_top_selling_title: this.getField<string>('home', 'home_top_selling_title'),
                    home_top_selling_description: this.getField<string>('home', 'home_top_selling_description'),
                    home_new_product_status: this.getActiveInactive('home', 'home_new_product_status'),
                    home_new_product_style: this.getField<string>('home', 'home_new_product_style'),
                    home_new_product_title: this.getField<string>('home', 'home_new_product_title'),
                    home_new_product_description: this.getField<string>('home', 'home_new_product_description'),
                    home_banner_coupons: this.getActiveInactive('home','home_banner_coupons'), //this.getField<number>('home', 'home_banner_coupons') || null,
                    home_banner_two_columns: this.getActiveInactive('home','home_banner_two_columns'), //this.getField<number>('home', 'home_banner_two_columns') || null,
                    home_banner_full_width: this.getActiveInactive('home','home_banner_full_width'), //this.getField<number>('home', 'home_banner_full_width') || null,
                    home_featured_categories_status: this.getActiveInactive('home', 'home_featured_categories_status'),
                    home_featured_categories_title: this.getField<string>('home', 'home_featured_categories_title'),
                    home_featured_categories_description: this.getField<string>('home', 'home_featured_categories_description'),
                    home_featured_categories_ids: this.getField<number[]>('home', 'home_featured_categories_ids') || null,
                    home_featured_categories_style: this.getField<CategoryFeatureStyleType>('home', 'home_featured_categories_style'),

                    analytics_facebook_pixel_status: this.getActiveInactive('other', 'analytics_facebook_pixel_status'),
                    analytics_facebook_pixel_id: this.getField<string>('other', 'analytics_facebook_pixel_id'),
                    analytics_google_status: this.getActiveInactive('other', 'analytics_google_status'),
                    analytics_google_id: this.getField<string>('other', 'analytics_google_id'),
                    recaptcha_status: this.getActiveInactive('other', 'recaptcha_status'),
                    recaptcha_secret_key: this.getField<string>('other', 'recaptcha_secret_key'),
                    recaptcha_site_key: this.getField<string>('other', 'recaptcha_site_key'),
                    mail_new_order_status: this.getActiveInactive('other', 'mail_new_order_status'),
                    mail_new_order_mails: this.getField<string>('other', 'mail_new_order_mails'),
                    mail_new_customer_status: this.getActiveInactive('other', 'mail_new_customer_status'),
                    mail_new_customer_mails: this.getField<string>('other', 'mail_new_customer_mails'),
                    social_networks : this.getFieldSimple<SocialNetworks[]>('social_networks')
                }
                this.store.dispatch(new CreateUpdateSettingOption(prepareForm))
            },
            error: (error) => {
                console.error(error)
            }
        })
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onRemoveSidebarProduct(element: ProductToSelect) {
        this.selectedProductsSidebar = this.selectedProductsSidebar.filter(item => item.code !== element.code)
    }
    onSelectedRelated(element: ProductToSelect) {
            if (!this.selectedProductsSidebar.find(item => item.code === element.code)) {
                this.selectedProductsSidebar = [...this.selectedProductsSidebar, element]
            }
    }
}
