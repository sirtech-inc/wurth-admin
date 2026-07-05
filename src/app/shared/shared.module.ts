import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AButtonComponent } from './components/ui/a-button/a-button.component';
import { AdvancedDropdownComponent } from './components/ui/advanced-dropdown/advanced-dropdown.component';
import { AlertComponent } from './components/ui/alert/alert.component';
import { AlertModalComponent } from './components/ui/modal/alert-modal/alert-modal.component';
import { ButtonComponent } from './components/ui/button/button.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ClickOutsideDirective } from './directive/out-side-directive';
import { ConfirmationModalComponent } from './components/ui/modal/confirmation-modal/confirmation-modal.component';
import { ContentComponent } from './components/layout/content/content.component';
import { CurrencySymbolPipe } from './pipe/currency-symbol.pipe';
import { DeleteModalComponent } from './components/ui/modal/delete-modal/delete-modal.component';
import { DropdownListComponent } from './components/ui/advanced-dropdown/dropdown-list/dropdown-list.component';
import { FeatherIconsComponent } from './components/ui/feather-icons/feather-icons.component';
import { FileState } from './state/file-image.state';
import { FileUploadComponent } from './components/ui/file-upload/file-upload.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormFieldsComponent } from './components/ui/form-fields/form-fields.component';
import { FullComponent } from './components/layout/full/full.component';
import { HeaderComponent } from './components/header/header.component';
import { ImageUploadComponent } from './components/ui/image-upload/image-upload.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MediaFilesModalComponent } from './components/ui/modal/media-files-modal/media-files-modal.component';
import { MediaModalComponent } from './components/ui/modal/media-modal/media-modal.component';
import { ModeComponent } from './components/header/widgets/mode/mode.component';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxsModule } from '@ngxs/store';
import { NoDataComponent } from './components/ui/no-data/no-data.component';
import { NotificationComponent } from './components/header/widgets/notification/notification.component';
import { NumberDirective } from './directive/numbers-only.directive';
import { PageWrapperComponent } from './components/page-wrapper/page-wrapper.component';
import { PaginationComponent } from './components/ui/pagination/pagination.component';
import { PasswordStrengthComponent } from './components/ui/password-strength/password-strength.component';
import { ProfileComponent } from './components/header/widgets/profile/profile.component';
import { RouterModule } from '@angular/router';
import { SearchComponent } from './components/header/widgets/search/search.component';
import { Select2Module } from 'ng-select2-component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarMenuSkeletonComponent } from './components/ui/skeleton/sidebar-menu-skeleton/sidebar-menu-skeleton.component';
import { SummaryPipe } from './pipe/summary.pipe';
import { TableComponent } from './components/ui/table/table.component';
import { TranslateModule } from '@ngx-translate/core';
import {AppPrimeNgModule} from "@shared/app-prime-ng.module";
import { ProductoModalComponent } from './components/ui/modal/producto-modal/producto-modal.component';

// Components









// UI
// import { AddtocartComponent } from './components/ui/product-box/modal/addtocart/addtocart.component';
// import { MediaBoxComponent } from './components/ui/media-box/media-box.component';
// import { ProductBoxComponent } from './components/ui/product-box/product-box.component';
// import { ProductBoxSkeletonComponent } from './components/ui/skeleton/product-box-skeleton/product-box-skeleton.component';








// import { LinkComponent } from './components/ui/link/link.component';










// Modal Components
// import { ImportCsvModalComponent } from './components/ui/modal/import-csv-modal/import-csv-modal.component';
// import { PayoutModalComponent } from './components/ui/modal/payout-modal/payout-modal.component';




// Directives
// import { HasPermissionDirective } from './directive/has-permission.directive';



// Pipes





@NgModule({
  declarations: [
    // AddtocartComponent,
    // Components
    // Directives
    // HasPermissionDirective,
    // ImportCsvModalComponent,
    // MediaBoxComponent,
    // Modal Components
    // PayoutModalComponent,
    // Pipes
    // ProductBoxComponent,
    // ProductBoxSkeletonComponent,
    // UI Components
    AButtonComponent,
    AdvancedDropdownComponent,
    AlertComponent,
    ButtonComponent,
    ClickOutsideDirective,
    ConfirmationModalComponent,
    ContentComponent,
    CurrencySymbolPipe,
    DeleteModalComponent,
    DropdownListComponent,
    FeatherIconsComponent,
    FooterComponent,
    FormFieldsComponent,
    FullComponent,
    HeaderComponent,
    ImageUploadComponent,
    // LinkComponent,
    LoaderComponent,
    MediaModalComponent,
    ModeComponent,
    NoDataComponent,
    NotificationComponent,
    NumberDirective,
    PageWrapperComponent,
    PaginationComponent,
    ProfileComponent,
    SearchComponent,
    SidebarComponent,
    SidebarMenuSkeletonComponent,
    SummaryPipe,
    TableComponent,
    FileUploadComponent,
    AlertModalComponent,
    PasswordStrengthComponent,
    MediaFilesModalComponent,
    ProductoModalComponent
  ],
  imports: [
    CarouselModule,
    CommonModule,
    FormsModule,
    NgbModule,
    NgxDropzoneModule,
    OverlayModule,
    ReactiveFormsModule,
    RouterModule,
    ScrollingModule,
    Select2Module,
    TranslateModule,
    NgxsModule.forFeature([
      FileState
    ]),
      AppPrimeNgModule
  ],
  providers: [CurrencyPipe],
    exports: [
        // AddtocartComponent,
        // Components
        // Directives
        // HasPermissionDirective,
        // ImportCsvModalComponent,
        // MediaBoxComponent,
        // Modals
        // Modules
        // PayoutModalComponent,
        // Pipes
        // ProductBoxComponent,
        // ProductBoxSkeletonComponent,
        AdvancedDropdownComponent,
        AlertComponent,
        AButtonComponent,
        ButtonComponent,
        CarouselModule,
        ConfirmationModalComponent,
        CurrencySymbolPipe,
        DeleteModalComponent,
        FeatherIconsComponent,
        FormFieldsComponent,
        FormsModule,
        ImageUploadComponent,
        // LinkComponent,
        LoaderComponent,
        MediaModalComponent,
        NgbModule,
        NoDataComponent,
        NumberDirective,
        PageWrapperComponent,
        PaginationComponent,
        ReactiveFormsModule,
        Select2Module,
        SummaryPipe,
        TableComponent,
        TranslateModule,
        FileUploadComponent,
        AlertModalComponent,
        PasswordStrengthComponent,
        ClickOutsideDirective,
        AppPrimeNgModule,
        ProductoModalComponent
    ]
})
export class SharedModule { }
