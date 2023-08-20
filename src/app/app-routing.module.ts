import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// *******************************************************************************
// Layouts

import { Layout1Component } from "./layout/layout-1/layout-1.component";

// *******************************************************************************
// Pages

import { HomeComponent } from "./home/home.component";
import { Page2Component } from "./page-2/page-2.component";
import { ProductlistComponent } from "./Pages/productlist/productlist.component";
import { ProductDetailComponent } from "./Pages/product-detail/product-detail.component";
import { ProductCustomizeComponent } from "./Pages/product-customize/product-customize.component";
import { AboutusComponent } from "./Pages/aboutus/aboutus.component";
import { FeaturesComponent } from "./Pages/features/features.component";
import { ProductsComponent } from "./Pages/products/products.component";
import { LoginComponent } from "./Pages/login/login.component";
import { MyAccountComponent } from "./Pages/my-account/my-account.component";
import { PrivacyPolicyComponent } from "./Pages/privacy-policy/privacy-policy.component";
import { ContactUsComponent } from "./Pages/contact-us/contact-us.component";
import { CartComponent } from "./Pages/cart/cart.component";
import { OrderDetailComponent } from "./Pages/order-detail/order-detail.component";
import { CompGuard } from "./guards/comp.guard";
import { TermsComponent } from "./terms/terms.component";
import { ProceedComponent } from "./proceed/proceed.component";
import { SearchComponent } from "./search/search.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { SuccessComponent } from "./success/success.component";
import { RegisterComponent } from "./Pages/register/register.component";
import { ForgotPasswordComponent } from "./Pages/forgot-password/forgot-password.component";
import { AuthGuard } from "./guards/auth.guard";
import { UnAuthGuard } from "./guards/unauth.guard";
import { RegisterGuard } from "./guards/register.guard";

const routes: Routes = [
  {
    path: "",
    component: Layout1Component,
    children: [
      { path: "", component: ProductlistComponent },
      { path: "products", component: ProductsComponent },
      { path: "proceed", component: ProceedComponent },
      { path: "productdetail/:id", component: ProductDetailComponent },
      { path: "productcustomize/:id", component: ProductCustomizeComponent },
      { path: "cart", component: CartComponent },
      { path: "orderdetail/:id", component: OrderDetailComponent },
      { path: "search", component: SearchComponent },
      { path: "checkout", component: CheckoutComponent },
      { path: "success", component: SuccessComponent },
      { path: "login", component: LoginComponent, canActivate: [UnAuthGuard] },
      {
        path: "register",
        component: RegisterComponent,
        canActivate: [RegisterGuard],
      },
      { path: "forgot-password", component: ForgotPasswordComponent },
      {
        path: "account",
        component: MyAccountComponent,
        canActivate: [AuthGuard],
      },
    ],
  },

  {
    path: "**",
    redirectTo: "",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      scrollPositionRestoration: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
