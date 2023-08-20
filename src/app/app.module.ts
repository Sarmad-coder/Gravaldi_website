import { NotificationService } from "./Services/notification.service";
import { BrowserModule, Title } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

// *******************************************************************************
// NgBootstrap

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

// *******************************************************************************
// App

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AppService } from "./app.service";
import { LayoutModule } from "./layout/layout.module";

// *******************************************************************************
// Pages
import { HttpClientModule } from "@angular/common/http";

import { HomeComponent } from "./home/home.component";
import { Page2Component } from "./page-2/page-2.component";
import { ProductlistComponent } from "./Pages/productlist/productlist.component";
import { ProductDetailComponent } from "./Pages/product-detail/product-detail.component";
import { ProductCustomizeComponent } from "./Pages/product-customize/product-customize.component";
import { AboutusComponent } from "./Pages/aboutus/aboutus.component";
import { ProductsComponent } from "./Pages/products/products.component";
import { FeaturesComponent } from "./Pages/features/features.component";
import { LoginComponent } from "./Pages/login/login.component";
import { MyAccountComponent } from "./Pages/my-account/my-account.component";
import { PrivacyPolicyComponent } from "./Pages/privacy-policy/privacy-policy.component";
import { ContactUsComponent } from "./Pages/contact-us/contact-us.component";
import { CartComponent } from "./Pages/cart/cart.component";
import { OrderDetailComponent } from "./Pages/order-detail/order-detail.component";
import { ToastrModule } from "ngx-toastr";
import { UserService } from "./Services/user.service";
import { ExtraService } from "./Services/extra.service";
import { ProductsService } from "./Services/products.service";
import { CountryService } from "./Services/country.service";
import { CompGuard } from "./guards/comp.guard";
import { OrderService } from "./Services/order.service";
import { DatePipe } from "@angular/common";
import { TermsComponent } from "./terms/terms.component";
import { ProceedComponent } from "./proceed/proceed.component";
import { NgOtpInputModule } from "ng-otp-input";
import { SearchComponent } from "./search/search.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { SubscribeService } from "./Services/subscribe.service";
import { SidenavModule } from "../vendor/libs/sidenav/sidenav.module";
import { LayoutFooterComponent } from "./layout/layout-footer/layout-footer.component";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ImageZoomComponent } from "./components/image-zoom/image-zoom.component";
import { NgxStripeModule } from "ngx-stripe";
import { SuccessComponent } from "./success/success.component";
import { FetchMeasurementPipe } from "./fetch-measurement.pipe";
import { RegisterComponent } from "./Pages/register/register.component";
import { ForgotPasswordComponent } from "./Pages/forgot-password/forgot-password.component";
import { SaveMeasurementComponent } from './components/save-measurement/save-measurement.component';

// *******************************************************************************
//
import { NgxViewerModule } from 'ngx-viewer';

@NgModule({
  declarations: [
    AppComponent,
    // Pages
    HomeComponent,
    Page2Component,
    ProductlistComponent,
    ProductDetailComponent,
    ProductCustomizeComponent,
    AboutusComponent,
    ProductsComponent,
    FeaturesComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    MyAccountComponent,
    PrivacyPolicyComponent,
    ContactUsComponent,
    CartComponent,
    OrderDetailComponent,
    TermsComponent,
    ProceedComponent,
    SearchComponent,
    CheckoutComponent,
    LayoutFooterComponent,
    ImageZoomComponent,
    SuccessComponent,
    FetchMeasurementPipe,
    SaveMeasurementComponent,
  ],

  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    LayoutModule,
    NgOtpInputModule,
    SidenavModule,
    InfiniteScrollModule,
    NgxStripeModule.forRoot("pk_live_eqgpLuCgwB1mn0qjduHrIA7V"),
    NgxViewerModule
    // NgxStripeModule.forRoot("pk_test_51MKfXjJRymQrzkHidtZSk5P969L7Xqp4TKmAba8XG4uIHoiDXFpt1lPJC4pUzNWkW69SaIXYJ1RVhEH7S38opezH00z1GUFA4O"),

  ],

  providers: [
    Title,
    AppService,
    UserService,
    ExtraService,
    ProductsService,
    CountryService,
    OrderService,
    DatePipe,
    CompGuard,
    NotificationService,
    SubscribeService,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
// platformBrowserDynamic().bootstrapModule(AppModule);
