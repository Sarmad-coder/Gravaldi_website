import { Component } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { AppService } from './app.service';
import { LayoutService } from './layout/layout.service';
import { ProductCustomizeComponent } from './Pages/product-customize/product-customize.component';
import { ExtraService } from './Services/extra.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [':host { display: block; }']
})
export class AppComponent {

  
  constructor(private router: Router, private appService: AppService, private layoutService: LayoutService,private extraSrv: ExtraService,) {
    // Subscribe to router events to handle page transition
    this.router.events.subscribe(this.navigationInterceptor.bind(this));
    this.extraSrv.navBarPosition$.subscribe(x=>{
      this.position=x;
    })
    console.log(this.position)

    // Disable animations and transitions in IE10 to increase performance
    if (typeof document['documentMode'] === 'number' && document['documentMode'] < 11) {
      const style = document.createElement('style');
      style.textContent = `
        * {
          -ms-animation: none !important;
          animation: none !important;
          -ms-transition: none !important;
          transition: none !important;
        }`;
      document.head.appendChild(style);
    }
  }

  position:any;
  

  private navigationInterceptor(e: RouterEvent) {
    if (e instanceof NavigationStart) {
      // Set loading state
      document.body.classList.add('app-loading');
    }

    if (e instanceof NavigationEnd) {
      // Scroll to top of the page
      this.appService.scrollTop(0, 0);
    }

    if (e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError) {
      // On small screens collapse sidenav
      if (this.layoutService.isSmallScreen() && !this.layoutService.isCollapsed()) {
        setTimeout(() => this.layoutService.setCollapsed(true, true), 10);
      }

      // Remove loading state
      document.body.classList.remove('app-loading');
      // Remove initial splash screen
      const splashScreen = document.querySelector('.app-splash-screen');
      if (splashScreen) {
        splashScreen['style'].opacity = 0;
        setTimeout(() => splashScreen && splashScreen.parentNode.removeChild(splashScreen), 300);
      }
    }
  }
}
